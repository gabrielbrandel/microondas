import React, { useState, useRef } from 'react';
import {
    CButton,
    CCard,
    CCardBody,
    CCardHeader,
    CCol,
    CForm,
    CFormInput,
    CFormLabel,
    CInputGroup,
    CRow,
    CImage,
} from '@coreui/react';

export const TelaMicroondas = () => {
    const [validated, setValidated] = useState(false);
    const [getInput, setInput] = useState('00:00');
    const [getPw, setPw] = useState(10);
    const [isRunning, setIsRunning] = useState(false);
    const [isPaused, setIsPaused] = useState(false); // Estado para controlar pausa
    const intervalRef = useRef(null);
    const [outputString, setOutputString] = useState(''); // String de saída

    const updateOutputString = (totalSeconds, power) => {
        const pointsPerSecond = '.'.repeat(power); // Gera os pontos baseados na potência
        setOutputString((prev) => prev + pointsPerSecond + ' '); // Adiciona os pontos a cada segundo
    };

    const handleSubmit = (event) => {
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
        }
        setValidated(true);
    };

    const convertSecondsToTime = (totalSeconds) => {
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    const handleInitial = () => {
        let [minutes, seconds] = getInput.split(':').map(Number);
        let totalSeconds = minutes * 60 + seconds;

        if (isPaused) {
            // Se o temporizador está pausado, retoma a contagem
            setIsRunning(true);
            setIsPaused(false);
            intervalRef.current = setInterval(() => {
                if (totalSeconds > 0) {
                    updateOutputString(totalSeconds, getPw);
                    totalSeconds -= 1;
                    setInput(convertSecondsToTime(totalSeconds));
                } else {
                    clearInterval(intervalRef.current);
                    setIsRunning(false);
                    setOutputString((prev) => prev + 'Aquecimento concluído');
                }
            }, 1000);
        } else if (!isRunning) {
            // Se o temporizador não está rodando e nem pausado, inicia o temporizador
            setIsRunning(true);
            setOutputString('');
            intervalRef.current = setInterval(() => {
                if (totalSeconds > 0) {
                    updateOutputString(totalSeconds, getPw);
                    totalSeconds -= 1;
                    setInput(convertSecondsToTime(totalSeconds));
                } else {
                    clearInterval(intervalRef.current);
                    setIsRunning(false);
                    setOutputString((prev) => prev + 'Aquecimento concluído');
                }
            }, 1000);
        } else if (isRunning) {
            // Se o temporizador já está rodando, adiciona 30 segundos
            totalSeconds += 30;
            setInput(convertSecondsToTime(totalSeconds));
        }
    };


    const handleCancel = () => {
        if (isRunning) {

            clearInterval(intervalRef.current);
            setIsRunning(false);
            setIsPaused(true);
        } else if (isPaused) {

            setIsPaused(false);
            setInput('00:00');
        } else if (!isRunning && !isPaused) {
            setInput('00:00');
            setOutputString('');
        }
    };

    const handleClick = (input) => {
        setInput((prev) => {
            let result = '';

            if (input === 'Potência') {
                result = '00:30';
            } else if (input === 'Relógio') {
                const now = new Date();
                const hours = now.getHours().toString().padStart(2, '0');
                const minutes = now.getMinutes().toString().padStart(2, '0');
                result = `${hours}:${minutes}`;
            } else if (input === 'Cancela/Pausa') {
                result = '00:00';
            } else if (!isNaN(input)) {
                let newTime = prev.replace(':', '') + input;
                newTime = newTime.slice(-4);

                if (newTime.length < 4) {
                    newTime = newTime.padStart(4, '0');
                }

                let minutes = parseInt(newTime.slice(0, 2), 10);
                let seconds = parseInt(newTime.slice(2, 4), 10);

                if (isNaN(minutes)) minutes = 0;
                if (isNaN(seconds)) seconds = 0;

                if (seconds >= 60 && seconds < 100) {
                    result = convertSecondsToTime(seconds + minutes * 60);
                } else {
                    result = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
                }
            }

            if (result > '02:00') {
                alert('O tempo excede 2 minutos! Por favor, insira um tempo válido.');
                result = prev;
            }

            return result;
        });
    };

    const handleIncreasePw = () => {
        if (getPw < 10) {
            setPw(getPw + 1);
        } else {
            alert('A potência não pode ser maior que 10!');
        }
    };

    const handleDecreasePw = () => {
        if (getPw > 1) {
            setPw(getPw - 1);
        } else {
            alert('A potência não pode ser menor que 1!');
        }
    };

    const handleInputChange = (e) => {
        setInput(e.target.value);
    };

    const ButtonGroups = ({ input, fonteSize, onClick }) => {
        return (
            <CRow>             
                <CCol md={1}>
                    <CButton
                        type="button"
                        color="secondary"
                        variant="ghost"
                        id="inputGroupFileAddon03"
                        onClick={onClick || (() => handleClick(input))} // Aplica onClick se passado, senão usa handleClick
                        style={{
                            height: '50px',
                            width: '65px',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            backgroundColor: '#6c7484',
                            border: 'none',
                            color: 'white',
                            padding: 0,
                            marginTop: '5px',
                            fontSize: fonteSize,
                            transition: 'transform 0.2s ease, background-color 0.3s ease',
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#5a6268';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = '#6c7484';
                        }}
                        onMouseDown={(e) => {
                            e.currentTarget.style.transform = 'scale(0.9)';
                        }}
                        onMouseUp={(e) => {
                            e.currentTarget.style.transform = 'scale(1)';
                        }}
                    >
                        {input}
                    </CButton>
                </CCol>
            </CRow>
        );
    };

    return (
        <CRow style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#242424' }}>
            <CCol xs={12} md={8} lg={6}>
                <CCard className="mb-4">
                    <CCardHeader>
                        <strong>Micro-ondas</strong>
                    </CCardHeader>

                    <CCardBody>
                        <CForm>
                            <CInputGroup>
                                <CCol md={1}>
                                    <CFormLabel htmlFor="validationCustom05">Visor</CFormLabel>
                                    <CFormInput
                                        type="string"
                                        id="validationCustom05"
                                        style={{ width: '90%' }}
                                        value={getInput}
                                        onChange={handleInputChange}
                                    />
                                </CCol>
                                <CCol md={3}>
                                    <CFormLabel htmlFor="validationCustom01">Potência</CFormLabel>
                                    <CInputGroup>
                                        <CButton
                                            type="button"
                                            color="secondary"
                                            variant="ghost"
                                            id="inputGroupFileAddon03"
                                            size="sm"
                                            onClick={handleIncreasePw} // Chama handleIncreasePw
                                            style={{
                                                height: '40px',
                                                width: '40px',
                                                backgroundColor: 'green',
                                                color: 'white',
                                                display: 'flex',
                                                justifyContent: 'center',
                                                alignItems: 'center',                                                
                                            }}
                                        >
                                            +
                                        </CButton>
                                        <CFormInput
                                            type="text"
                                            id="validationCustom01"
                                            value={getPw} // O valor de getPw será mostrado aqui
                                            readOnly // Campo somente leitura
                                            required
                                        />
                                        <CButton
                                            type="button"
                                            color="secondary"
                                            variant="ghost"
                                            id="inputGroupFileAddon03"
                                            size="sm"
                                            onClick={handleDecreasePw} // Chama handleDecreasePw
                                            style={{
                                                height: '40px',
                                                width: '40px',
                                                backgroundColor: 'red',
                                                color: 'white',
                                                display: 'flex',
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                            }}
                                        >
                                            -
                                        </CButton>
                                    </CInputGroup>
                                </CCol>
                            </CInputGroup>

                            <CInputGroup>
                                <ButtonGroups input={'1'} fonteSize="20px" />
                                <ButtonGroups input={'2'} fonteSize="20px" />
                                <ButtonGroups input={'3'} fonteSize="20px" />
                                <ButtonGroups input={'Pipoca'} fonteSize="10px" />
                            </CInputGroup>

                            <CInputGroup>
                                <ButtonGroups input={'4'} fonteSize="20px" />
                                <ButtonGroups input={'5'} fonteSize="20px" />
                                <ButtonGroups input={'6'} fonteSize="20px" />
                                <ButtonGroups input={'Leite'} fonteSize="10px" />
                            </CInputGroup>

                            <CInputGroup>
                                <ButtonGroups input={'7'} fonteSize="20px" />
                                <ButtonGroups input={'8'} fonteSize="20px" />
                                <ButtonGroups input={'9'} fonteSize="20px" />
                                <ButtonGroups input={'Carnes de Boi'} fonteSize="10px" />
                            </CInputGroup>

                            <CInputGroup>
                                <ButtonGroups input={'Cancela/Pausa'} fonteSize="9px" onClick={handleCancel} />
                                <ButtonGroups input={'0'} fonteSize="20px" />
                                <ButtonGroups input={'Iniciar/+30'} fonteSize="12px" onClick={handleInitial} />
                                <ButtonGroups input={'Frango'} fonteSize="10px" />
                            </CInputGroup>

                            <CInputGroup>
                                <ButtonGroups input={'Custom 1'} fonteSize="10px" />
                                <ButtonGroups input={'Custom 2'} fonteSize="10px" />
                                <ButtonGroups input={'Custom 3'} fonteSize="10px" />
                                <ButtonGroups input={'Feijão'} fonteSize="10px" />
                            </CInputGroup>


                            <CInputGroup>
                                <CCol md={12}>
                                    <CFormLabel htmlFor="outputString">Resultado</CFormLabel>
                                    <CFormInput
                                        type="text"
                                        id="outputString"
                                        value={outputString}
                                        readOnly
                                        style={{ width: '100%' }}
                                    />
                                </CCol>
                            </CInputGroup>
                        </CForm>
                    </CCardBody>
                </CCard>
            </CCol>
        </CRow>
    );
};
