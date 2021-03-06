import React, {useState, useEffect} from 'react'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import Icon from '@material-ui/core/Icon'
import DeleteIcon from '@material-ui/icons/Delete'
import '../Admin.css'
import configURL from '../../../helper/constant'

import CustomSelect from '../../common/CustomSelect'
import FileUploader from '../../common/FileUploader'
import CustomSnackbar from '../../common/CustomSnackbar'

function CollectionEdit(props) {
    const [collections, setCollections] = useState([''])
    const [newBlob, setNewBlob] = useState(null)
    const [selected, setSelected] = useState({})
    const [isReinit, setIsReinit] = useState(false)
    const [openSnack, setOpenSnack] = useState(false)
    const [snackText, setSnackText] = useState("Collection sauvegardée en base de données")
    const snackEdit = "Collection sauvegardée en base de données"
    const snackDelete = "Collection supprimée de la base de données"

    useEffect(()=>{
        setCollections(props.collectionNames)
    },[props.collectionNames])

    const getCollection = async (id)=>{
        await fetch(`${configURL}/collection/`+id)
        .then(response => response.json())
        .then(result => {
            if(result.pic){
                const imageStr = Buffer.from(result.pic.data).toString('base64');
                result.pic = "data:image/jpeg;base64,"+imageStr
            }
            return setSelected(result)
        })
    }

    function getUploadedImg(img) {
        setNewBlob(img)
    }

    const handleEdit = async(event)=>{
        setOpenSnack(false)
        event.preventDefault();
        const data = new FormData(event.target);

        const body = JSON.stringify({
            id: selected.id,
            name: data.get('title'),
            detail: data.get('detail'),
            pic: newBlob,
        });

        const headers = {
            'content-type': 'application/json',
            accept: 'application/json',
        };
        await fetch(`${configURL}/collection/`+selected.id, {
            method: 'PUT',
            headers,
            body,
        });
        setSnackText(snackEdit)
        handleReinit()
    }

    const handleDelete = async () => {
        setOpenSnack(false)
        if(selected){
            const id = selected.id
            await fetch(`${configURL}/collection/`+id, {
                method: 'DELETE',
                headers: {
                    'content-type': 'application/json',
                    accept: 'application/json',
                },
            });
            setSnackText(snackDelete)
            handleReinit()
        }else{
            console.log('erreur, pas de collection à supprimer')
        }
    }

    function handleReinit(){
        setOpenSnack(true)
        props.changeInCollec()
        setIsReinit(true)
        setNewBlob(null)
        setSelected({})
        setCollections(props.collectionNames)
    }

    function handleChangeSelect(collecId) {
        setIsReinit(false)
        getCollection(collecId)
    }

    return (
        <div className="edit">
            <div className="edit-row">
                <p><strong>Editer</strong> une collection existante</p>
                <CustomSelect reinit={isReinit} list={collections} title="Collections" handleChange={handleChangeSelect}/>
            </div>
            <form onSubmit={handleEdit} noValidate autoComplete="off" key={selected ? selected.id : ''}>
                <TextField 
                    className="input"
                    required
                    id="standard-required"
                    label="Titre"
                    defaultValue={selected ? selected.name : ''}
                    margin="normal"
                    name="title"
                    fullWidth
                />
                <TextField 
                    className="input"
                    id="standard-required"
                    label="Détail"
                    defaultValue={selected ? selected.detail : ''}
                    margin="normal"
                    multiline={true}
                    name="detail"
                    fullWidth
                />
                <FileUploader parentGiveImg={(selected && selected.pic) ? selected.pic : null} parentGetImg={getUploadedImg}/>
                <div className="send">
                    <Button className="reinit" variant="contained" color="primary" onClick={handleReinit} >
                        Réinit.
                        <Icon className="icon">autorenew</Icon>
                    </Button>
                    <Button className="save" type="submit" variant="contained" color="default">
                        Sauver
                        <Icon className="icon">send</Icon>
                    </Button>
                    <Button className="delete" variant="contained" color="secondary" onClick={handleDelete}>
                        Supprimer
                        <DeleteIcon className="icon" />
                    </Button>
                </div>
            </form>
            <CustomSnackbar handleOpen={openSnack} text={snackText} />
        </div>
    )
}

export default CollectionEdit