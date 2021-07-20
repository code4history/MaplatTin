/* eslint-disable @typescript-eslint/ban-ts-comment */
// This library is based on
// https://savithru-j.github.io/cdt-js/
// Copyright 2018 Savithru Jayasinghe
// Licensed under the MIT License
// A fast algorithm for generating constrained delaunay triangulations
// https://www.sciencedirect.com/science/article/pii/004579499390239A
// A robust efficient algorithm for point location in triangulations
// https://www.cl.cam.ac.uk/techreports/UCAM-CL-TR-728.pdf

import { polygon, featureCollection, FeatureCollection } from "@turf/helpers";

class Point {
  // eslint-disable-next-line no-useless-constructor
  constructor(public x: number, public y: number) {}

  public dot(p1: Point): number {
    return this.x * p1.x + this.y * p1.y;
  }

  public add(p1: Point): Point {
    return new Point(this.x + p1.x, this.y + p1.y);
  }

  public sub(p1: Point): Point {
    return new Point(this.x - p1.x, this.y - p1.y);
  }

  public scale(s: number): Point {
    return new Point(this.x * s, this.y * s);
  }

  public sqDistanceTo(p1: Point): number {
    return (
      (this.x - p1.x) * (this.x - p1.x) + (this.y - p1.y) * (this.y - p1.y)
    );
  }

  public toStr(): string {
    return `(${this.x.toFixed(3)}, ${this.y.toFixed(3)})`;
  }

  public copyFrom(p: Point): void {
    this.x = p.x;
    this.y = p.y;
  }
}

function cross(vec0: Point, vec1: Point): number {
  return vec0.x * vec1.y - vec0.y * vec1.x;
}

function getPointOrientation(edge: [Point, Point], p: Point): number {
  const vec_edge01 = edge[1].sub(edge[0]);
  const vec_edge0_to_p = p.sub(edge[0]);
  return cross(vec_edge01, vec_edge0_to_p);
}

//Some variables for rendering
const fieldOrigin = new Point(0.0, 0.0); //new Point(-16000000, -16000000);
const fieldSize = 1.0; //32000000;
const boundingTriangleSize = 1000; //1000000000;

interface Bin {
  ind: number;
  bin: number;
}

function binSorter(a: Bin, b: Bin) {
  if (a.bin == b.bin) {
    return 0;
  } else {
    return a.bin < b.bin ? -1 : 1;
  }
}

function isQuadConvex(p0: Point, p1: Point, p2: Point, p3: Point): boolean {
  const diag0: [Point, Point] = [p0, p2];
  const diag1: [Point, Point] = [p1, p3];
  return isEdgeIntersecting(diag0, diag1);
}

function isSameEdge(edge0: Edge, edge1: Edge): boolean {
  return (
    (edge0[0] == edge1[0] && edge0[1] == edge1[1]) ||
    (edge0[1] == edge1[0] && edge0[0] == edge1[1])
  );
}

function isEdgeIntersecting(
  edgeA: [Point, Point],
  edgeB: [Point, Point]
): boolean {
  const vecA0A1 = edgeA[1].sub(edgeA[0]);
  const vecA0B0 = edgeB[0].sub(edgeA[0]);
  const vecA0B1 = edgeB[1].sub(edgeA[0]);
  const AxB0 = cross(vecA0A1, vecA0B0);
  const AxB1 = cross(vecA0A1, vecA0B1);
  //Check if the endpoints of edgeB are on the same side of edgeA
  if ((AxB0 > 0 && AxB1 > 0) || (AxB0 < 0 && AxB1 < 0)) return false;
  const vecB0B1 = edgeB[1].sub(edgeB[0]);
  const vecB0A0 = edgeA[0].sub(edgeB[0]);
  const vecB0A1 = edgeA[1].sub(edgeB[0]);
  const BxA0 = cross(vecB0B1, vecB0A0);
  const BxA1 = cross(vecB0B1, vecB0A1);
  //Check if the endpoints of edgeA are on the same side of edgeB
  if ((BxA0 > 0 && BxA1 > 0) || (BxA0 < 0 && BxA1 < 0)) return false;
  //Special case of colinear edges
  if (Math.abs(AxB0) < 1e-14 && Math.abs(AxB1) < 1e-14) {
    //Separated in x
    if (
      Math.max(edgeB[0].x, edgeB[1].x) < Math.min(edgeA[0].x, edgeA[1].x) ||
      Math.min(edgeB[0].x, edgeB[1].x) > Math.max(edgeA[0].x, edgeA[1].x)
    )
      return false;
    //Separated in y
    if (
      Math.max(edgeB[0].y, edgeB[1].y) < Math.min(edgeA[0].y, edgeA[1].y) ||
      Math.min(edgeB[0].y, edgeB[1].y) > Math.max(edgeA[0].y, edgeA[1].y)
    )
      return false;
  }
  return true;
}

interface Mesh {
  vert: Point[];
  scaled_vert: Point[];
  bin: Bin[];
  tri: [[number, number, number]];
  adj: [[number, number, number]];
  vert_to_tri: any[];
  con_edge: Edge[];
}

function setupDelaunay(meshData: Mesh) {
  const nVertex = meshData.vert.length;
  const nBinsX = Math.round(Math.pow(nVertex, 0.25));
  //Compute scaled vertex coordinates and assign each vertex to a bin
  const scaledverts: Point[] = [];
  const bin_index: Bin[] = [];
  for (let i = 0; i < nVertex; i++) {
    const scaled_x = (meshData.vert[i].x - fieldOrigin.x) / fieldSize;
    const scaled_y = (meshData.vert[i].y - fieldOrigin.y) / fieldSize;
    scaledverts.push(new Point(scaled_x, scaled_y));
    const ind_i = Math.round((nBinsX - 1) * scaled_x);
    const ind_j = Math.round((nBinsX - 1) * scaled_y);
    let bin_id: number;
    if (ind_j % 2 === 0) {
      bin_id = ind_j * nBinsX + ind_i;
    } else {
      bin_id = (ind_j + 1) * nBinsX - ind_i - 1;
    }
    bin_index.push({ ind: i, bin: bin_id });
  }
  //Add super-triangle vertices (far away)
  const D = boundingTriangleSize;
  scaledverts.push(new Point(-D + 0.5, -D / Math.sqrt(3) + 0.5));
  scaledverts.push(new Point(D + 0.5, -D / Math.sqrt(3) + 0.5));
  scaledverts.push(new Point(0.5, (2 * D) / Math.sqrt(3) + 0.5));
  for (let i = nVertex; i < nVertex + 3; i++)
    meshData.vert.push(
      new Point(
        fieldSize * scaledverts[i].x + fieldOrigin.x,
        fieldSize * scaledverts[i].y + fieldOrigin.y
      )
    );
  //Sort the vertices in ascending bin order
  bin_index.sort(binSorter);
  meshData.scaled_vert = scaledverts;
  meshData.bin = bin_index;
  //Super-triangle connectivity
  meshData.tri = [[nVertex, nVertex + 1, nVertex + 2]];
  meshData.adj = [[-1, -1, -1]];
  meshData.vert_to_tri = [];
}

//Function for computing the unconstrained Delaunay triangulation
function delaunay(meshData: Mesh): void {
  //Sort input vertices and setup super-triangle
  setupDelaunay(meshData);
  const verts = meshData.scaled_vert;
  const bins = meshData.bin;
  const triangles = meshData.tri;
  const adjacency = meshData.adj;
  const N = verts.length - 3; //vertices includes super-triangle nodes
  let ind_tri = 0; //points to the super-triangle
  for (let i = 0; i < N; i++) {
    const new_i = bins[i].ind;
    const res = findEnclosingTriangle(verts[new_i], meshData, ind_tri);
    ind_tri = res[0];
    if (ind_tri === -1)
      throw "Could not find a triangle containing the new vertex!";
    const cur_tri = triangles[ind_tri]; //vertex indices of triangle containing new point
    const new_tri0: [number, number, number] = [cur_tri[0], cur_tri[1], new_i];
    const new_tri1: [number, number, number] = [new_i, cur_tri[1], cur_tri[2]];
    const new_tri2: [number, number, number] = [cur_tri[0], new_i, cur_tri[2]];
    //Replace the triangle containing the point with new_tri0, and
    //fix its adjacency
    triangles[ind_tri] = new_tri0;
    const N_tri = triangles.length;
    const cur_tri_adj = adjacency[ind_tri]; //neighbors of cur_tri
    adjacency[ind_tri] = [N_tri, N_tri + 1, cur_tri_adj[2]];
    //Add the other two new triangles to the list
    triangles.push(new_tri1); //triangle index N_tri
    triangles.push(new_tri2); //triangle index (N_tri+1)
    adjacency.push([cur_tri_adj[0], N_tri + 1, ind_tri]); //adj for triangle N_tri
    adjacency.push([N_tri, cur_tri_adj[1], ind_tri]); //adj for triangle (N_tri+1)
    //stack of triangles which need to be checked for Delaunay condition
    //each element contains: [index of tri to check, adjncy index to goto triangle that contains new point]
    const stack: [number, number][] = [];
    if (cur_tri_adj[2] >= 0) {
      //if triangle cur_tri's neighbor exists
      //Find the index for cur_tri in the adjacency of the neighbor
      const neigh_adj_ind = adjacency[cur_tri_adj[2]].indexOf(ind_tri);
      //No need to update adjacency, but push the neighbor on to the stack
      stack.push([cur_tri_adj[2], neigh_adj_ind]);
    }
    if (cur_tri_adj[0] >= 0) {
      //if triangle N_tri's neighbor exists
      //Find the index for cur_tri in the adjacency of the neighbor
      const neigh_adj_ind = adjacency[cur_tri_adj[0]].indexOf(ind_tri);
      adjacency[cur_tri_adj[0]][neigh_adj_ind] = N_tri;
      stack.push([cur_tri_adj[0], neigh_adj_ind]);
    }
    if (cur_tri_adj[1] >= 0) {
      //if triangle (N_tri+1)'s neighbor exists
      //Find the index for cur_tri in the adjacency of the neighbor
      const neigh_adj_ind = adjacency[cur_tri_adj[1]].indexOf(ind_tri);
      adjacency[cur_tri_adj[1]][neigh_adj_ind] = N_tri + 1;
      stack.push([cur_tri_adj[1], neigh_adj_ind]);
    }
    restoreDelaunay(new_i, meshData, stack);
  } //loop over vertices
  removeBoundaryTriangles(meshData);
}

//Uses edge orientations - based on Peter Brown's Technical Report 1997
function findEnclosingTriangle(
  target_vertex: Point,
  meshData: Mesh,
  ind_tri_cur: number
): number[] {
  const vertices = meshData.scaled_vert;
  const triangles = meshData.tri;
  const adjacency = meshData.adj;
  const max_hops = Math.max(10, adjacency.length);
  let nhops = 0;
  const found_tri = false;
  const path = [];
  while (!found_tri && nhops < max_hops) {
    if (ind_tri_cur === -1)
      //target is outside triangulation
      return [ind_tri_cur, nhops];
    const tri_cur = triangles[ind_tri_cur];
    //Orientation of target wrt each edge of triangle (positive if on left of edge)
    const orients = [
      getPointOrientation(
        [vertices[tri_cur[1]], vertices[tri_cur[2]]],
        target_vertex
      ),
      getPointOrientation(
        [vertices[tri_cur[2]], vertices[tri_cur[0]]],
        target_vertex
      ),
      getPointOrientation(
        [vertices[tri_cur[0]], vertices[tri_cur[1]]],
        target_vertex
      )
    ];
    if (orients[0] >= 0 && orients[1] >= 0 && orients[2] >= 0)
      //target is to left of all edges, so inside tri
      return [ind_tri_cur, nhops];
    let base_ind = -1;
    for (let iedge = 0; iedge < 3; iedge++) {
      if (orients[iedge] >= 0) {
        base_ind = iedge;
        break;
      }
    }
    const base_p1_ind = (base_ind + 1) % 3;
    const base_p2_ind = (base_ind + 2) % 3;
    if (orients[base_p1_ind] >= 0 && orients[base_p2_ind] < 0) {
      ind_tri_cur = adjacency[ind_tri_cur][base_p2_ind]; //should move to the triangle opposite base_p2_ind
      path[nhops] = vertices[tri_cur[base_ind]]
        .add(vertices[tri_cur[base_p1_ind]])
        .scale(0.5);
    } else if (orients[base_p1_ind] < 0 && orients[base_p2_ind] >= 0) {
      ind_tri_cur = adjacency[ind_tri_cur][base_p1_ind]; //should move to the triangle opposite base_p1_ind
      path[nhops] = vertices[tri_cur[base_p2_ind]]
        .add(vertices[tri_cur[base_ind]])
        .scale(0.5);
    } else {
      const vec0 = vertices[tri_cur[base_p1_ind]].sub(
        vertices[tri_cur[base_ind]]
      ); //vector from base_ind to base_p1_ind
      const vec1 = target_vertex.sub(vertices[tri_cur[base_ind]]); //vector from base_ind to target_vertex
      if (vec0.dot(vec1) > 0) {
        ind_tri_cur = adjacency[ind_tri_cur][base_p2_ind]; //should move to the triangle opposite base_p2_ind
        path[nhops] = vertices[tri_cur[base_ind]]
          .add(vertices[tri_cur[base_p1_ind]])
          .scale(0.5);
      } else {
        ind_tri_cur = adjacency[ind_tri_cur][base_p1_ind]; //should move to the triangle opposite base_p1_ind
        path[nhops] = vertices[tri_cur[base_p2_ind]]
          .add(vertices[tri_cur[base_ind]])
          .scale(0.5);
      }
    }
    nhops++;
  }
  if (!found_tri) {
    throw `Could not locate the triangle that encloses (${target_vertex.x}, ${target_vertex.y})!`;
  }
  return [ind_tri_cur, nhops - 1];
}

function restoreDelaunay(
  ind_vert: number,
  meshData: Mesh,
  stack: [number, number][]
) {
  const vertices = meshData.scaled_vert;
  const triangles = meshData.tri;
  const adjacency = meshData.adj;
  const v_new = vertices[ind_vert];
  while (stack.length > 0) {
    const ind_tri_pair = stack.pop(); //[index of tri to check, adjncy index to goto triangle that contains new point]
    // @ts-expect-error
    const ind_tri = ind_tri_pair[0];
    const ind_tri_vert = triangles[ind_tri]; //vertex indices of the triangle
    // @ts-expect-error
    const v_tri: [Point, Point, Point] = [];
    for (let i = 0; i < 3; i++) v_tri[i] = vertices[ind_tri_vert[i]];
    if (!isDelaunay2(v_tri, v_new)) {
      //v_new lies inside the circumcircle of the triangle, so need to swap diagonals
      // @ts-expect-error
      const outernode_tri = ind_tri_pair[1]; // [0,1,2] node-index of vertex that's not part of the common edge
      const ind_tri_neigh = adjacency[ind_tri][outernode_tri];
      if (ind_tri_neigh < 0) throw "negative index";
      //Swap the diagonal between the adjacent triangles
      swapDiagonal(meshData, ind_tri, ind_tri_neigh);
      //Add the triangles opposite the new vertex to the stack
      const new_node_ind_tri = triangles[ind_tri].indexOf(ind_vert);
      const ind_tri_outerp2 = adjacency[ind_tri][new_node_ind_tri];
      if (ind_tri_outerp2 >= 0) {
        const neigh_node = adjacency[ind_tri_outerp2].indexOf(ind_tri);
        stack.push([ind_tri_outerp2, neigh_node]);
      }
      const new_node_ind_tri_neigh = triangles[ind_tri_neigh].indexOf(ind_vert);
      const ind_tri_neigh_outer =
        adjacency[ind_tri_neigh][new_node_ind_tri_neigh];
      if (ind_tri_neigh_outer >= 0) {
        const neigh_node = adjacency[ind_tri_neigh_outer].indexOf(
          ind_tri_neigh
        );
        stack.push([ind_tri_neigh_outer, neigh_node]);
      }
    } //is not Delaunay
  }
}
//Swaps the diagonal of adjacent triangles A and B
function swapDiagonal(
  meshData: Mesh,
  ind_triA: number,
  ind_triB: number
): void {
  const triangles = meshData.tri;
  const adjacency = meshData.adj;
  const vert2tri = meshData.vert_to_tri;
  //Find the node index of the outer vertex in each triangle
  const outernode_triA = adjacency[ind_triA].indexOf(ind_triB);
  const outernode_triB = adjacency[ind_triB].indexOf(ind_triA);
  //Indices of nodes after the outernode (i.e. nodes of the common edge)
  const outernode_triA_p1 = (outernode_triA + 1) % 3;
  const outernode_triA_p2 = (outernode_triA + 2) % 3;
  const outernode_triB_p1 = (outernode_triB + 1) % 3;
  const outernode_triB_p2 = (outernode_triB + 2) % 3;
  //Update triangle nodes
  triangles[ind_triA][outernode_triA_p2] = triangles[ind_triB][outernode_triB];
  triangles[ind_triB][outernode_triB_p2] = triangles[ind_triA][outernode_triA];
  //Update adjacencies for triangle opposite outernode
  adjacency[ind_triA][outernode_triA] = adjacency[ind_triB][outernode_triB_p1];
  adjacency[ind_triB][outernode_triB] = adjacency[ind_triA][outernode_triA_p1];
  //Update adjacency of neighbor opposite triangle A's (outernode+1) node
  const ind_triA_neigh_outerp1 = adjacency[ind_triA][outernode_triA_p1];
  if (ind_triA_neigh_outerp1 >= 0) {
    const neigh_node = adjacency[ind_triA_neigh_outerp1].indexOf(ind_triA);
    adjacency[ind_triA_neigh_outerp1][neigh_node] = ind_triB;
  }
  //Update adjacency of neighbor opposite triangle B's (outernode+1) node
  const ind_triB_neigh_outerp1 = adjacency[ind_triB][outernode_triB_p1];
  if (ind_triB_neigh_outerp1 >= 0) {
    const neigh_node = adjacency[ind_triB_neigh_outerp1].indexOf(ind_triB);
    adjacency[ind_triB_neigh_outerp1][neigh_node] = ind_triA;
  }
  //Update adjacencies for triangles opposite the (outernode+1) node
  adjacency[ind_triA][outernode_triA_p1] = ind_triB;
  adjacency[ind_triB][outernode_triB_p1] = ind_triA;
  //Update vertex to triangle connectivity, if data structure exists
  if (vert2tri.length > 0) {
    //The original outernodes will now be part of both triangles
    vert2tri[triangles[ind_triA][outernode_triA]].push(ind_triB);
    vert2tri[triangles[ind_triB][outernode_triB]].push(ind_triA);
    //Remove triangle B from the triangle set of outernode_triA_p1
    let local_ind = vert2tri[triangles[ind_triA][outernode_triA_p1]].indexOf(
      ind_triB
    );
    vert2tri[triangles[ind_triA][outernode_triA_p1]].splice(local_ind, 1);
    //Remove triangle A from the triangle set of outernode_triB_p1
    local_ind = vert2tri[triangles[ind_triB][outernode_triB_p1]].indexOf(
      ind_triA
    );
    vert2tri[triangles[ind_triB][outernode_triB_p1]].splice(local_ind, 1);
  }
}
function removeBoundaryTriangles(meshData: Mesh): void {
  const verts = meshData.scaled_vert;
  const triangles = meshData.tri;
  const adjacency = meshData.adj;
  const N = verts.length - 3;
  let del_count = 0;
  const indmap: number[] = [];
  for (let i = 0; i < triangles.length; i++) {
    const prev_del_count = del_count;
    for (let j = i; j < triangles.length; j++) {
      if (triangles[j][0] < N && triangles[j][1] < N && triangles[j][2] < N) {
        indmap[i + del_count] = i;
        break;
      } else {
        indmap[i + del_count] = -1;
        del_count++;
      }
    }
    const del_length = del_count - prev_del_count;
    if (del_length > 0) {
      triangles.splice(i, del_length);
      adjacency.splice(i, del_length);
    }
  }
  //Update adjacencies
  for (let i = 0; i < adjacency.length; i++)
    for (let j = 0; j < 3; j++) adjacency[i][j] = indmap[adjacency[i][j]];
  //Delete super-triangle nodes
  meshData.scaled_vert.splice(-3, 3);
  meshData.vert.splice(-3, 3);
}

function isDelaunay2(v_tri: [Point, Point, Point], p: Point): boolean {
  const vecp0 = v_tri[0].sub(p);
  const vecp1 = v_tri[1].sub(p);
  const vecp2 = v_tri[2].sub(p);
  const p0_sq = vecp0.x * vecp0.x + vecp0.y * vecp0.y;
  const p1_sq = vecp1.x * vecp1.x + vecp1.y * vecp1.y;
  const p2_sq = vecp2.x * vecp2.x + vecp2.y * vecp2.y;
  const det =
    vecp0.x * (vecp1.y * p2_sq - p1_sq * vecp2.y) -
    vecp0.y * (vecp1.x * p2_sq - p1_sq * vecp2.x) +
    p0_sq * (vecp1.x * vecp2.y - vecp1.y * vecp2.x);
  return det <= 0;
}

function constrainEdges(meshData: Mesh) {
  if (meshData.con_edge.length == 0) return;
  buildVertexConnectivity(meshData);
  const con_edges = meshData.con_edge;
  const triangles = meshData.tri;
  const verts = meshData.scaled_vert;
  const adjacency = meshData.adj;
  const vert2tri = meshData.vert_to_tri;
  const newEdgeList: any = [];
  for (let iedge = 0; iedge < con_edges.length; iedge++) {
    let intersections = getEdgeIntersections(meshData, iedge);
    let iter = 0;
    const maxIter = Math.max(intersections.length, 1);
    while (intersections.length > 0 && iter < maxIter) {
      fixEdgeIntersections(meshData, intersections, iedge, newEdgeList);
      intersections = getEdgeIntersections(meshData, iedge);
      iter++;
    }
    if (intersections.length > 0)
      throw `Could not add edge ${iedge} to triangulation after ${maxIter} iterations!`;
  } //loop over constrained edges
  //Restore Delaunay
  // eslint-disable-next-line no-constant-condition
  while (true) {
    let num_diagonal_swaps = 0;
    for (let iedge = 0; iedge < newEdgeList.length; iedge++) {
      const new_edge_nodes = newEdgeList[iedge];
      //Check if the new edge is a constrained edge
      let is_con_edge = false;
      for (let jedge = 0; jedge < con_edges.length; jedge++) {
        if (isSameEdge(new_edge_nodes, con_edges[jedge])) {
          is_con_edge = true;
          break;
        }
      }
      if (is_con_edge) continue; //cannot change this edge if it's constrained
      const tri_around_v0 = vert2tri[new_edge_nodes[0]];
      let tri_count = 0;
      const tri_ind_pair = [-1, -1]; //indices of the triangles on either side of this edge
      for (let itri = 0; itri < tri_around_v0.length; itri++) {
        const cur_tri = triangles[tri_around_v0[itri]];
        if (
          cur_tri[0] == new_edge_nodes[1] ||
          cur_tri[1] == new_edge_nodes[1] ||
          cur_tri[2] == new_edge_nodes[1]
        ) {
          tri_ind_pair[tri_count] = tri_around_v0[itri];
          tri_count++;
          if (tri_count == 2) break; //found both neighboring triangles
        }
      }
      if (tri_ind_pair[0] == -1) continue; //this edge no longer exists, so nothing to do.
      const triA_verts: [Point, Point, Point] = [
        verts[triangles[tri_ind_pair[0]][0]],
        verts[triangles[tri_ind_pair[0]][1]],
        verts[triangles[tri_ind_pair[0]][2]]
      ];
      const outer_nodeB_ind = adjacency[tri_ind_pair[1]].indexOf(
        tri_ind_pair[0]
      );
      const triB_vert = verts[triangles[tri_ind_pair[1]][outer_nodeB_ind]];
      if (!isDelaunay2(triA_verts, triB_vert)) {
        const outer_nodeA_ind = adjacency[tri_ind_pair[0]].indexOf(
          tri_ind_pair[1]
        );
        //Swap the diagonal between the pair of triangles
        swapDiagonal(meshData, tri_ind_pair[0], tri_ind_pair[1]);
        num_diagonal_swaps++;
        //Replace current new edge with the new diagonal
        newEdgeList[iedge] = [
          triangles[tri_ind_pair[0]][outer_nodeA_ind],
          triangles[tri_ind_pair[1]][outer_nodeB_ind]
        ];
      }
    } //loop over new edges
    if (num_diagonal_swaps == 0) break; //no further swaps, we're done.
  }
}
function buildVertexConnectivity(meshData: Mesh): void {
  const triangles = meshData.tri;
  meshData.vert_to_tri = [];
  const vConnectivity = meshData.vert_to_tri;
  for (let itri = 0; itri < triangles.length; itri++) {
    for (let node = 0; node < 3; node++) {
      if (vConnectivity[triangles[itri][node]] == undefined)
        vConnectivity[triangles[itri][node]] = [itri];
      else vConnectivity[triangles[itri][node]].push(itri);
    }
  }
}
function getEdgeIntersections(meshData: Mesh, iedge: any) {
  const triangles = meshData.tri;
  const verts = meshData.scaled_vert;
  const adjacency = meshData.adj;
  const con_edges = meshData.con_edge;
  const vert2tri = meshData.vert_to_tri;
  const edge_v0_ind = con_edges[iedge][0];
  const edge_v1_ind = con_edges[iedge][1];
  const edge_coords: [Point, Point] = [verts[edge_v0_ind], verts[edge_v1_ind]];
  const tri_around_v0 = vert2tri[edge_v0_ind];
  let edge_in_triangulation = false;
  //stores the index of tri that intersects current edge,
  //and the edge-index of intersecting edge in triangle
  const intersections = [];
  for (let itri = 0; itri < tri_around_v0.length; itri++) {
    const cur_tri = triangles[tri_around_v0[itri]];
    const v0_node = cur_tri.indexOf(edge_v0_ind);
    const v0p1_node = (v0_node + 1) % 3;
    const v0p2_node = (v0_node + 2) % 3;
    if (edge_v1_ind == cur_tri[v0p1_node]) {
      //constrained edge is an edge of the current tri (node v0_node to v0_node+1)
      edge_in_triangulation = true;
      break;
    } else if (edge_v1_ind == cur_tri[v0p2_node]) {
      //constrained edge is an edge of the current tri (node v0_node to v0_node+2)
      edge_in_triangulation = true;
      break;
    }
    const opposite_edge_coords: [Point, Point] = [
      verts[cur_tri[v0p1_node]],
      verts[cur_tri[v0p2_node]]
    ];
    if (isEdgeIntersecting(edge_coords, opposite_edge_coords)) {
      intersections.push([tri_around_v0[itri], v0_node]);
      break;
    }
  }
  if (!edge_in_triangulation) {
    if (intersections.length == 0) throw "Cannot have no intersections!";
    // eslint-disable-next-line no-constant-condition
    while (true) {
      const prev_intersection: any = intersections[intersections.length - 1]; //[tri ind][node ind for edge]
      const tri_ind = adjacency[prev_intersection[0]][prev_intersection[1]];
      if (
        triangles[tri_ind][0] == edge_v1_ind ||
        triangles[tri_ind][1] == edge_v1_ind ||
        triangles[tri_ind][2] == edge_v1_ind
      ) {
        break; //found the end node of the edge
      }
      //Find the index of the edge from which we came into this triangle

      const prev_edge_ind = adjacency[tri_ind].indexOf(prev_intersection[0]);
      if (prev_edge_ind == -1) throw "Could not find edge!";
      const cur_tri = triangles[tri_ind];
      //Loop over the other two edges in this triangle,
      //and check if they intersect the constrained edge
      for (let offset = 1; offset < 3; offset++) {
        const v0_node = (prev_edge_ind + offset + 1) % 3;
        const v1_node = (prev_edge_ind + offset + 2) % 3;
        const cur_edge_coords: [Point, Point] = [
          verts[cur_tri[v0_node]],
          verts[cur_tri[v1_node]]
        ];
        if (isEdgeIntersecting(edge_coords, cur_edge_coords)) {
          intersections.push([tri_ind, (prev_edge_ind + offset) % 3]);
          break;
        }
      }
    } //while intersections not found
  } //if edge not in triangulation
  return intersections;
}
function fixEdgeIntersections(
  meshData: Mesh,
  intersectionList: any,
  con_edge_ind: any,
  newEdgeList: any
) {
  const triangles = meshData.tri;
  const verts = meshData.scaled_vert;
  const adjacency = meshData.adj;
  const con_edges = meshData.con_edge;
  //Node indices and endpoint coords of current constrained edge
  const con_edge_nodes = con_edges[con_edge_ind];
  const cur_con_edge_coords: [Point, Point] = [
    verts[con_edge_nodes[0]],
    verts[con_edge_nodes[1]]
  ];
  const nIntersections = intersectionList.length;
  for (let i = 0; i < nIntersections; i++) {
    //Looping in reverse order is important since then the
    //indices in intersectionList remain unaffected by any diagonal swaps
    const tri0_ind = intersectionList[nIntersections - 1 - i][0];
    const tri0_node = intersectionList[nIntersections - 1 - i][1];
    const tri1_ind = adjacency[tri0_ind][tri0_node];
    const tri1_node = adjacency[tri1_ind].indexOf(tri0_ind);
    const quad_v0 = verts[triangles[tri0_ind][tri0_node]];
    const quad_v1 = verts[triangles[tri0_ind][(tri0_node + 1) % 3]];
    const quad_v2 = verts[triangles[tri1_ind][tri1_node]];
    const quad_v3 = verts[triangles[tri0_ind][(tri0_node + 2) % 3]];
    const isConvex = isQuadConvex(quad_v0, quad_v1, quad_v2, quad_v3);
    if (isConvex) {
      swapDiagonal(meshData, tri0_ind, tri1_ind);
      const newDiagonal_nodes = [
        triangles[tri0_ind][tri0_node],
        triangles[tri1_ind][tri1_node]
      ];
      const newDiagonal_coords: [Point, Point] = [quad_v0, quad_v2];
      const hasCommonNode =
        newDiagonal_nodes[0] == con_edge_nodes[0] ||
        newDiagonal_nodes[0] == con_edge_nodes[1] ||
        newDiagonal_nodes[1] == con_edge_nodes[0] ||
        newDiagonal_nodes[1] == con_edge_nodes[1];
      if (
        hasCommonNode ||
        !isEdgeIntersecting(cur_con_edge_coords, newDiagonal_coords)
      ) {
        newEdgeList.push([newDiagonal_nodes[0], newDiagonal_nodes[1]]);
      }
    } //is convex
  } //loop over intersections
}
function loadEdges(meshData: Mesh, edges: Edge[]) {
  const nVertex = meshData.vert.length;
  meshData.con_edge = [];
  for (let i = 0; i < edges.length; i++) {
    const edge = edges[i];
    if (
      edge[0] < 0 ||
      edge[0] >= nVertex ||
      edge[1] < 0 ||
      edge[1] >= nVertex
    ) {
      throw `Vertex indices of edge ${i} need to be non-negative and less than the number of input vertices.`;
      // meshData.con_edge = [];
      // break;
    }
    if (edge[0] === edge[1]) {
      throw `Edge ${i} is degenerate!`;
      // meshData.con_edge = [];
      // break;
    }
    if (!isEdgeValid(edge, meshData.con_edge, meshData.vert)) {
      throw `Edge ${i} already exists or intersects with an existing edge!`;
      // meshData.con_edge = [];
      // break;
    }
    meshData.con_edge.push([edge[0], edge[1]]);
  }
}
function isEdgeValid(
  newEdge: Edge,
  edgeList: Mesh["con_edge"],
  vertices: Mesh["vert"]
): boolean {
  const new_edge_verts: [Point, Point] = [
    vertices[newEdge[0]],
    vertices[newEdge[1]]
  ];
  for (let i = 0; i < edgeList.length; i++) {
    //Not valid if edge already exists
    if (
      (edgeList[i][0] == newEdge[0] && edgeList[i][1] == newEdge[1]) ||
      (edgeList[i][0] == newEdge[1] && edgeList[i][1] == newEdge[0])
    )
      return false;
    const hasCommonNode =
      edgeList[i][0] == newEdge[0] ||
      edgeList[i][0] == newEdge[1] ||
      edgeList[i][1] == newEdge[0] ||
      edgeList[i][1] == newEdge[1];
    const edge_verts: [Point, Point] = [
      vertices[edgeList[i][0]],
      vertices[edgeList[i][1]]
    ];
    if (!hasCommonNode && isEdgeIntersecting(edge_verts, new_edge_verts))
      return false;
  }
  return true;
}

type Edge = [number, number];

export default function (points: FeatureCollection, edges: Edge[], z: string) {
  if (!edges) edges = [];
  if (typeof points !== "object" || points.type !== "FeatureCollection")
    throw "Argument points must be FeatureCollection";
  if (!Array.isArray(edges)) throw "Argument points must be Array of Array";
  let isPointZ = false;
  // Caluculating scale factor
  // Original cdt-js not working well with coordinates between (0,0)-(1,1)
  // So points must be normalized
  const xyzs = points.features.reduce(
    (prev: any, point) => {
      // @ts-expect-error
      const xy = point.geometry.coordinates;
      prev[0].push(xy[0]);
      prev[1].push(xy[1]);
      if (z) {
        // @ts-expect-error
        prev[2].push(point.properties[z]);
      } else if (xy.length === 3) {
        isPointZ = true;
        // @ts-expect-error
        prev[2].push(point.geometry.coordinates[2]);
      }
      return prev;
    },
    [[], [], []]
  ) as [[number, number, number], [number, number, number], any];

  const xMax = Math.max.apply(null, xyzs[0]);
  const xMin = Math.min.apply(null, xyzs[0]);
  const yMax = Math.max.apply(null, xyzs[1]);
  const yMin = Math.min.apply(null, xyzs[1]);
  const xDiff = xMax - xMin;
  const xCenter = (xMax + xMin) / 2.0;
  const yDiff = yMax - yMin;
  const yCenter = (yMax + yMin) / 2.0;
  const maxDiff = Math.max(xDiff, yDiff) * 1.1;
  // Normalize points
  const normPoints = points.features.map(point => {
    // @ts-expect-error
    const xy = point.geometry.coordinates;
    const normXy = [
      (xy[0] - xCenter) / maxDiff + 0.5,
      (xy[1] - yCenter) / maxDiff + 0.5
    ];
    return new Point(normXy[0], normXy[1]);
  });
  // Create data structure for cdt-js
  const meshData = {
    vert: normPoints
  } as Mesh;
  // Load edges to data structure, with checking error
  loadEdges(meshData, edges);
  // Calculating Delaunay
  delaunay(meshData);
  // Applying edges constrain
  constrainEdges(meshData);
  // Unnormalize points and create output results
  const keys = ["a", "b", "c"] as const;
  return featureCollection(
    meshData.tri.map(indices => {
      const properties: any = {};
      const coords = indices.map((index, i) => {
        const coord: [number, number] = [xyzs[0][index], xyzs[1][index]];
        if (xyzs[2][index] !== undefined) {
          if (isPointZ) {
            // @ts-expect-error
            coord[2] = xyzs[2][index];
          } else {
            properties[keys[i]] = xyzs[2][index];
          }
        }
        return coord;
      });
      coords[3] = coords[0];
      return polygon([coords], properties);
    })
  );
}
