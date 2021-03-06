import React, {useState, useEffect} from 'react'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import Icon from '@material-ui/core/Icon'
import '../Admin.css'
import configURL from '../../../helper/constant'

import CustomSelect from '../../common/CustomSelect'
import FileUploader from '../../common/FileUploader'
import CustomSnackbar from '../../common/CustomSnackbar'

function PaintingCreate(props) {
    const [newBlob, setNewBlob] = useState(null)
    const [collectionNames, setCollectionNames] = useState([])
    const [selectedCollection, setSelectedCollection] = useState({})
    const [openSnack, setOpenSnack] = useState(false)
    const [isReinit, setIsReinit] = useState(false)

    useEffect(()=>{
        setCollectionNames(props.collectionNames)
    }, [props.collectionNames])

    function getUploadedImg(img) {
        setNewBlob(img)
    }

    const handleSubmitCreate = async (event) => {
        event.preventDefault()
        const data = new FormData(event.target)
        
        const body = JSON.stringify({
            name: data.get('title'),
            detail: data.get('detail'),
            pic: newBlob,
            likes: 0,
            collectionId: selectedCollection.id,
        })
        const headers = {
            'content-type': 'application/json',
            accept: 'application/json',
        }
        await fetch(`${configURL}/painting`, {
            method: 'POST',
            headers,
            body,
        })
        .then(response => response.status === 201 ? successfulPost() : null)
    }

    function successfulPost(){
        setOpenSnack(true)
        document.getElementById("painting-form-create").reset()
        setNewBlob(null)
        setIsReinit(true)
        props.updatePainting()
    }

    function handleChangeSelect(collecId) {
        setIsReinit(false)
        setSelectedCollection(collectionNames.find(collec => collec.id === collecId))
    }

    return (
        <div className="create">
            <p><strong>Créer</strong> un nouveau tableau</p>
            <CustomSelect reinit={isReinit} list={collectionNames} title="Collection du tableau *" handleChange={handleChangeSelect}/>
            <form id="painting-form-create" onSubmit={handleSubmitCreate} noValidate autoComplete="off">
                <TextField 
                    className="input"
                    required
                    id="standard-required"
                    label="Titre"
                    defaultValue=""
                    margin="normal"
                    name="title"
                    fullWidth
                />
                <TextField 
                    className="input"
                    id="standard-required"
                    label="Détail"
                    defaultValue=""
                    margin="normal"
                    multiline={true}
                    name="detail"
                    fullWidth
                />
                <FileUploader parentGiveImg={newBlob} parentGetImg={getUploadedImg}/>

                <Button className="send" type="submit" variant="contained" color="default" >
                    Envoyer 
                    <Icon className="icon">send</Icon>
                </Button>
            </form>
            <CustomSnackbar handleOpen={openSnack} text="Tableau sauvegardé en base de données" />
        </div>
    )
}

export default PaintingCreate