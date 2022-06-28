function addGeoJsonFeaturesToScene(features, radius) {
  const lines = new THREE.Group();
  // GEOJSON to ThreeJS
  for (let i = 0; i < features.length; i++) {
    let feature = features[i];
    let coords = [];
    for (let c = 0; c < feature.geometry.coordinates.length; c++) {
      if (feature.geometry.type == "Polygon") {
        let coords = [];
        for (let s = 0; s < feature.geometry.coordinates[c].length; s++) {
          let xy = {
            x: feature.geometry.coordinates[c][s][0],
            y: feature.geometry.coordinates[c][s][1]
          };
          coords.push(xy);
        }

        if (coords.length > 0) {
          lines.add(createLineFromCoords(coords, radius));
        }
      } else if (feature.geometry.type == "MultiPolygon") {
        for (let s = 0; s < feature.geometry.coordinates[c].length; s++) {
          //each polygon in multipolygon:
          let coords = [];
          for (let m = 0; m < feature.geometry.coordinates[c][s].length; m++) {
            let xy = {
              x: feature.geometry.coordinates[c][s][m][0],
              y: feature.geometry.coordinates[c][s][m][1]
            };
            coords.push(xy);
          }
        }
        if (coords.length > 0) {
          lines.add(createLineFromCoords(coords, radius));
        }
      } else if (feature.geometry.type == "LineString") {
        let xy = {
          x: feature.geometry.coordinates[c][0],
          y: feature.geometry.coordinates[c][1]
        };
        coords.push(xy);
      }
    }
    if ((feature.geometry.type = "LineString")) {
      if (coords.length > 0) {
        lines.add(createLineFromCoords(coords, radius));
      }
    }
  }
  return lines;
}

function createLineFromCoords(coords, radius) {
  let lineGeom = new THREE.BufferGeometry();
  let positions = [];
  for (var i = 0; i < coords.length; i++) {
    let lat = coords[i].y;
    let lon = coords[i].x;
    let latRad = lat * (Math.PI / 180);
    let lonRad = -lon * (Math.PI / 180);
    let x = Math.cos(latRad) * Math.cos(lonRad) * radius;
    let y = Math.sin(latRad) * radius;
    let z = Math.cos(latRad) * Math.sin(lonRad) * radius;
    positions.push(x, y, z);
    //lineGeom.vertices.push(new THREE.Vector3(x, y, z));
  }

  lineGeom.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(positions, 3)
  );
  const lineMaterial = new THREE.LineBasicMaterial({
    linewidth: 1,
    color: "white"
  })
  return new THREE.Line(lineGeom, lineMaterial);
}
