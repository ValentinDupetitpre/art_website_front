import React, {lazy, Suspense, useEffect} from 'react'
import './CardVertical.css'

const SmallImageComponent = lazy(() => import('./SmallImageComponent'));

function CardVertical(props)  {

    useEffect(()=>{
        console.log(props)
    })
    return(
        <div className="frame">
            <div className="card">
                <div className="painting">
                    <Suspense fallback={<div>Loading...</div>}>
                        <SmallImageComponent title={props.title} idPainting={props.idPainting}/>
                    </Suspense>
                </div>
            </div>
        </div>
    )
}

export default CardVertical; 