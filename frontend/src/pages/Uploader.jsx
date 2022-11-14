import React, { useState } from 'react';
import axios from 'axios';

const Uploader = () => {
    
    const [selectedFile, setSelectedFile] = useState(''); 

    const onSelectFile = (e) => {
        const file = e.target.files[0];
        console.log(file)
        
        let reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onloadend = () => {
            setSelectedFile(reader.result)
        }
    };

    const uploadImage = async (e) => {
        e.preventDefault()
        try {
            const response = await axios.post('api/event/uploadPic', {selectedFile})
            if (response.success === true) {
                setSelectedFile('')
            }
        } catch (error) {
            console.log('here')
            console.log(error)
        }
      };

    return (
        <div>
            <h1 className="title">Upload an Image</h1>
            <form onSubmit={uploadImage} className="form">
                <input
                    id="fileInput"
                    type="file"
                    name="image"
                    onChange={onSelectFile}
                    className="form-input"
                />
                <button className="btn" type="submit">
                    Submit
                </button>
            </form>
        </div>
    );
}

export default Uploader;
