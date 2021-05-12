import { decode, encode } from 'base-64';
import { ExpoWebGLRenderingContext, GLView } from 'expo-gl';
import * as THREE from 'three';
import ExpoTHREE from 'expo-three';
import { Renderer } from 'expo-three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import React, { useEffect } from 'react';
import {
    AmbientLight,
    PerspectiveCamera,
    PointLight,
    GridHelper,
    Scene,
    SpotLight,
} from 'three';
import { Asset } from 'expo-asset';
import { Button, View } from 'react-native';
import { Touchable } from 'react-native';
import { TouchableOpacity } from 'react-native';

if (!global.btoa) {
    global.btoa = encode;
}

if (!global.atob) {
    global.atob = decode;
}

let model: THREE.Group;

export default function App() {
    let timeout: number;

    useEffect(() => {
        return () => clearTimeout(timeout);
    }, []);

    return (
        // <View>
        <GLView
            style={{ flex: 1 }}
            onContextCreate={async (gl: ExpoWebGLRenderingContext) => {
                const {
                    drawingBufferWidth: width,
                    drawingBufferHeight: height,
                } = gl;

                const renderer = new Renderer({ gl });
                renderer.setSize(width, height);

                const camera = new PerspectiveCamera(
                    80,
                    width / height,
                    0.01,
                    1000
                );
                camera.position.z = 500;
                // camera.position.y = 0.5;
                // camera.position.x = 20.5;
                const asset = Asset.fromModule(require('../assets/mel.gltf'));
                await asset.downloadAsync();

                const scene = new Scene();
                scene.add(new GridHelper(10, 10));

                const ambientLight = new AmbientLight(0x101010);
                scene.add(ambientLight);

                const pointLight = new PointLight(0xffffff, 2, 1000, 1);
                pointLight.position.set(0, 200, 200);
                scene.add(pointLight);

                const spotLight = new SpotLight(0xffffff, 0.5);
                spotLight.position.set(0, 500, 100);
                spotLight.lookAt(scene.position);
                scene.add(spotLight);

                const loader = new GLTFLoader();
                loader.load(
                    asset.localUri || '',
                    (gltf) => {
                        model = gltf.scene;
                        scene.add(model);
                    },
                    (xhr) => {
                        console.log(
                            `${(xhr.loaded / xhr.total) * 100}% loaded`
                        );
                    },
                    (error) => {
                        console.error('An error happened', error);
                    }
                );

                function update() {
                    if (model) model.rotation.y += 0.004;
                }

                const render = () => {
                    timeout = requestAnimationFrame(render);
                    update();
                    renderer.render(scene, camera);
                    gl.endFrameEXP();
                };
                render();
            }}
        />
        // </View>
    );
}
