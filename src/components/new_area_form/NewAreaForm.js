import React from "react";
import axios from 'axios';
import "./NewAreaForm.css";
import close from "../../close.svg";
import { transformLayersToAreas } from "../../Utilities/LocationHelper"
const baseURL = "http:localhost:3000";
const _axios = axios.create({
    baseURL
});

const mainAxios = axios.create({
    baseURL: 'http://localhost:3000/'
});

const profileAxios = axios.create({
    baseURL: 'http://localhost:6000/profile'
});


export default function NewAreaForm(props) {
    const [name, setArea] = React.useState("");
    const [description, setDescription] = React.useState("");
    const [acceptedTerms, setAcceptedTerms] = React.useState(false);

    // var latlngs = [
    //     [
    //         // [41.83, -87.62],
    //         // [32.76, -96.72],
    //         // [40.78, -73.91],
    //         // [41.83, -87.62],
    //     ]
    // ];

    const submitMappedArea = async (layers) => {
        const areas = transformLayersToAreas(layers)
        areas.name = name;
        areas.advertiser = name;
        areas.description = description;
        console.log("Transformed Areas ", JSON.stringify(areas));
        mainAxios.post('/api/v2/areas', areas)
            .then(function (response) {
                console.log(response);
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    const handleSubmit = async(event) => {
        props.handler();
        submitMappedArea(props.layers);
        event.preventDefault();
    }

    return (
        <div className="close-form-container">
            <img src={close} alt="logo" className="close-form"
                width={20} height={20} onClick={props.handler} />
            <form onSubmit={handleSubmit}>
                <h1>New Area</h1>

                <label>
                    Name:
                    <input
                        name="name"
                        type="name"
                        value={name}
                        onChange={e => setArea(e.target.value)}
                        required />
                </label>

                <label>
                    Description:
                    <input
                        name="description"
                        type="description"
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                        required />
                </label>
                <label>
                    <input
                        name="acceptedTerms"
                        type="checkbox"
                        onChange={e => setAcceptedTerms(e.target.value)}
                        required />
                    I accept the terms of service
                </label>

                <button>Submit</button>
            </form>
        </div>
    );
}
