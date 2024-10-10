import React, { useState } from 'react';
import { CButton, CModal, CModalHeader, CModalBody, CModalFooter } from '@coreui/react';

const ConfirmModal = () => {
    const [visible, setVisible] = useState(false); // Estado para controlar a visibilidade do modal
    const [confirmResult, setConfirmResult] = useState(null); // Armazena o resultado da escolha do usuário

    // Função para abrir o modal
    const handleOpenModal = () => {
        setVisible(true);
    };

    // Função para fechar o modal
    const handleCloseModal = () => {
        setVisible(false);
    };

    // Função chamada quando o usuário clica em "Sim"
    const handleConfirmYes = () => {
        setConfirmResult('Sim');
        handleCloseModal();
        // Ação adicional que você deseja realizar após o "Sim"
    };

    // Função chamada quando o usuário clica em "Não"
    const handleConfirmNo = () => {
        setConfirmResult('Não');
        handleCloseModal();
        // Ação adicional que você deseja realizar após o "Não"
    };

    return (
        <>
            {/* Botão para abrir o modal */}
            <CButton color="primary" onClick={handleOpenModal}>
                Abrir Modal de Confirmação
            </CButton>

            {/* Modal de confirmação */}
            <CModal visible={visible} onClose={handleCloseModal}>
                <CModalHeader>Confirmação</CModalHeader>
                <CModalBody>Você tem certeza que deseja continuar?</CModalBody>
                <CModalFooter>
                    {/* Botão "Sim" */}
                    <CButton color="success" onClick={handleConfirmYes}>
                        Sim
                    </CButton>
                    {/* Botão "Não" */}
                    <CButton color="danger" onClick={handleConfirmNo}>
                        Não
                    </CButton>
                </CModalFooter>
            </CModal>

            {/* Resultado da confirmação */}
            {confirmResult && <p>Você escolheu: {confirmResult}</p>}
        </>
    );
};

export default ConfirmModal;
