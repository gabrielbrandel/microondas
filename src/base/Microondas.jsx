import React from 'react';

import {
    CCol,
    CRow,
    CCardBody,
} from '@coreui/react'
import { TelaMicroondas } from '../view/TelaMicroondas'

const Microondas = () => {

    return (
        <CRow>
            <CCol xs={12}>
                <CCardBody>
                </CCardBody>                
                <TelaMicroondas />
            </CCol>
        </CRow>
    )
}

export default Microondas

