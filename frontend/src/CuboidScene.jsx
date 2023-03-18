//
import React, { useEffect, useRef } from "react";
import * as BABYLON from "babylonjs";

const Cube = (props) => {
  console.log(props.img);
  const canvasRef = useRef(null);

  useEffect(() => {
    // Initialize Babylon.js engine and create a new scene
    const engine = new BABYLON.Engine(canvasRef.current, true);
    const scene = new BABYLON.Scene(engine);

    // Set the background color of the scene
    scene.clearColor = new BABYLON.Color4(0, 0, 0, 1);

    // Create a camera and attach it to the canvas for user interaction
    const camera = new BABYLON.ArcRotateCamera(
      "camera",
      -Math.PI / 2,
      Math.PI / 2,
      5,
      new BABYLON.Vector3(0, 0, 0),
      scene
    );
    camera.attachControl(canvasRef.current, true);

    // Create a light source to illuminate the scene
    const light = new BABYLON.HemisphericLight(
      "light",
      new BABYLON.Vector3(0, 1, 0),
      scene
    );

    // Create a material for the cuboid
    const material = new BABYLON.StandardMaterial("material", scene);
    // material.diffuseColor = new BABYLON.Color3(0, 0, 1);
    material.specularColor = new BABYLON.Color3(1, 1, 1);
    material.emissiveColor = new BABYLON.Color3(1, 1, 1);
    scene.ambientColor = new BABYLON.Color3(1, 1, 1);

    // Load a texture and assign it to the material
    material.diffuseTexture = new BABYLON.Texture(props.img, scene);

    // Create a cuboid with the specified dimensions
    const cuboid = BABYLON.MeshBuilder.CreateBox(
      "cuboid",
      { height: 3, width: 2, depth: 1 },
      scene
    );

    // Increase the size of the cuboid by scaling it in each direction
    cuboid.scaling.z = 2; // increase depth of the cuboid
    cuboid.scaling.x = 4; // increase width of the cuboid
    cuboid.scaling.y = 1.5; // increase height of the cuboid

    // Assign the material to the cuboid
    cuboid.material = material;

    // Render the scene in a continuous loop
    const render = () => {
      engine.runRenderLoop(() => {
        scene.render();
      });
    };

    // Resize the canvas when the window size changes
    const handleWindowResize = () => {
      engine.resize();
    };

    window.addEventListener("resize", handleWindowResize);

    // Start rendering the scene and return a canvas element
    render();

    // Clean up event listeners and dispose of Babylon.js engine when component unmounts
    return () => {
      window.removeEventListener("resize", handleWindowResize);
      engine.dispose();
    };
  }, [props.img]);

  return <canvas ref={canvasRef} style={{ width: "100%" }} />;
};

export default Cube;
