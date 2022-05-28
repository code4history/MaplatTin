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
import Delaunator from "delaunator"
import Constrainautor from "@kninnug/constrainautor"

type Edge = [number, number];

export default function (points: FeatureCollection, edges: Edge[], z: string) {
  if (!edges) edges = [];
  if (typeof points !== "object" || points.type !== "FeatureCollection")
    throw "Argument points must be FeatureCollection";
  if (!Array.isArray(edges)) throw "Argument points must be Array of Array";

  const del_points = points.features.map(point => (point.geometry as any).coordinates as number[]);
  let del = Delaunator.from(del_points);
  let con;
  const tris = [];
  if (del.triangles.length !== 0 && edges.length !== 0) {
    con = new Constrainautor(del);
    con.delaunify(true);
    del = con.del as any;
  }
  for (let i = 0; i < del.triangles.length; i += 3) {
    tris.push([
      del.triangles[i],
      del.triangles[i + 1],
      del.triangles[i + 2]
    ]);
  }

  const keys = ["a", "b", "c"] as const;
  return featureCollection(
    tris.map(indices => {
      const properties: any = {};
      const coords = indices.map((index, i) => {
        const point = points.features[index];
        const xyz = (point.geometry as any).coordinates as number[];
        const coord: number[] = [xyz[0], xyz[1]];
        if (xyz.length === 3) {
          coord[2] = xyz[2]
        } else {
          properties[keys[i]] = point.properties![z];
        }
        return coord;
      });
      coords[3] = coords[0];
      return polygon([coords], properties);
    })
  );
}
