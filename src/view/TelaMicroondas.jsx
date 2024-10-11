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

import useFetchProgramados from '../components/api/methods/GetProgramados';
import usePostProgramados from '../components/api/methods/PostProgramados';
import useDeleteProgramados from '../components/api/methods/DeleteProgramados';
import { useGesture } from '@use-gesture/react';

export const TelaMicroondas = () => {
    const intervalRef = useRef(null);
    const [getInput, setInput] = useState('00:00');
    const [getPw, setPw] = useState(10);
    const [isRunning, setIsRunning] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [outputString, setOutputString] = useState('');
    const { fetchProgramados, loading, error } = useFetchProgramados();
    const {postProgramados} = usePostProgramados();
    const {deleteProgramados } = useDeleteProgramados();
    const [string, setString] = useState('.');
    const [getResponse, setResponse] = useState('');
    const [getImage, setImage] = useState("./src/images/micro_off.jpg");
    const [timer, setTimer] = useState(null);
    const [isPressed, setIsPressed] = useState(false);
    const [isPressed2, setIsPressed2] = useState(false);
    const [isPressed3, setIsPressed3] = useState(false);

    const bind = useGesture({
        onPointerDown: (state) => {
            setIsPressed(true);
            const newTimer = setTimeout(() => {

                const confirmDelete = window.confirm('Tem certeza que deseja limpar essa customização?');

                if (confirmDelete) {
                    deleteProgramados(6);
                    cleanSets();
                }
                setIsPressed(false);
                setTimer(null);
            }, 3000);
            setTimer(newTimer);
        },
        onPointerUp: () => {
            if (timer) {
                clearTimeout(timer);
                setTimer(null);
            }
            setIsPressed(false);
        }
    });

    const bindButton2 = useGesture({
        onPointerDown: (state) => {
            setIsPressed2(true);
            const newTimer = setTimeout(() => {

                const confirmDelete = window.confirm('Tem certeza que deseja limpar essa customização?');

                if (confirmDelete) {
                    deleteProgramados(7);
                    cleanSets();
                }

                setIsPressed2(false);
                setTimer(null);
            }, 3000);
            setTimer(newTimer);
        },
        onPointerUp: () => {
            if (timer) {
                clearTimeout(timer);
                setTimer(null);
            }
            setIsPressed2(false);
        }
    });
    const bindButton3 = useGesture({
        onPointerDown: (state) => {
            setIsPressed3(true);
            const newTimer = setTimeout(() => {

                const confirmDelete = window.confirm('Tem certeza que deseja limpar essa customização?');

                if (confirmDelete) {                    
                    deleteProgramados(8);
                    cleanSets();
                }

                setIsPressed3(false);
                setTimer(null);
            }, 3000);
            setTimer(newTimer);
        },
        onPointerUp: () => {
            if (timer) {
                clearTimeout(timer);
                setTimer(null);
            }
            setIsPressed3(false);
        }
    });

    const handleFetchProgramados = async (id, string) => {

        const response = await fetchProgramados(id);

        // console.log('teste:', response);
        if (typeof response !== 'undefined' && response !== null) {
            setResponse(JSON.stringify(response, null, 2));
            setOutputString('');
            setString(string);
            setPw(response.potencia);
            setInput(convertToTimeFormat(response.tempo));
        } else {            
            const values = {
                id: id, 
                nome: "Custom",
                alimento: "Custom",
                tempo: `${convertToMinutes(getInput)} minuto${convertToMinutes(getInput) !== 1 ? 's' : ''}` , 
                potencia: getPw, 
                instrucao: "Aquecimento personalizado."
            };
            
            if (convertToMinutes(getInput) > 0) {
                try {
                    const postResponse = await postProgramados(values); 
                    console.log('Resposta do post:', postResponse);

                    if (postResponse) {
                        setpostResponse(JSON.stringify(postResponse, null, 2));
                        setOutputString('');
                        setString(string);
                        setPw(postResponse.potencia);
                        setInput(convertToTimeFormat(postResponse.tempo));
                    }
                } catch (error) {
                    console.error('Erro ao postar dados:', error);
                }
            } else {
                alert('O tempo configurado deve ser maior ou igual a 1 minuto.');
            }
        }
    };

    const convertToMinutes = (timeString) => {
        const [minutes] = timeString.split(':').map(Number); 
        return `${minutes}`; 
    };

    const convertSecondsToTime = (totalSeconds) => {
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    const convertToTimeFormat = (timeString) => {
        const minutes = timeString.match(/\d+/)[0];
        const formattedMinutes = minutes.padStart(2, '0');

        return `${formattedMinutes}:00`;
    };

    const updateOutputString = (totalSeconds, power) => {
        const pointsPerSecond = `${string}`.repeat(power);
        setOutputString((prev) => prev + pointsPerSecond + ' ');
    };

    const handleInitial = () => {
        let [minutes, seconds] = getInput.split(':').map(Number);
        let totalSeconds = minutes * 60 + seconds;


        if (isPaused) {

            setImage("./src/images/micro_on.jpg");
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
                    setImage("./src/images/micro_off.jpg");
                }
            }, 1000);
        } else if (!isRunning) {

            setImage("./src/images/micro_on.jpg");
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
                    setImage("./src/images/micro_off.jpg");
                }
            }, 1000);
        } else if (isRunning) {

            totalSeconds += 30;
            setInput(convertSecondsToTime(totalSeconds));
        }
    };

    const handleCancel = () => {
        if (isRunning) {

            clearInterval(intervalRef.current);
            setIsRunning(false);
            setIsPaused(true);
            setImage("./src/images/micro_off.jpg");
        } else if (isPaused) {
            setIsPaused(false);
            cleanSets();

        } else if (!isRunning && !isPaused) {
            cleanSets();
        }
    };

    const cleanSets = () => {
        setString('.');
        setOutputString('');
        setInput('00:00');
        setResponse('');
        setImage("./src/images/micro_off.jpg");
    }

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

    const ButtonGroups = ({ input, fonteSize, onClick, fonte }) => {
        return (
            <CRow>
                <CCol md={1}>
                    <CButton
                        type="button"
                        color="secondary"
                        variant="ghost"
                        id="inputGroupFileAddon03"
                        onClick={onClick || (() => handleClick(input))}
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
                            fontStyle: fonte ? 'italic' : 'normal',
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
                            <CRow>
                                <CCol xs={12} md={6}>
                                    <CInputGroup>
                                        <CCol md={6}>
                                            <CFormLabel htmlFor="validationCustom05">Visor</CFormLabel>
                                            <CFormInput
                                                type="string"
                                                id="validationCustom05"
                                                style={{ width: '90%' }}
                                                value={getInput}
                                                onChange={handleInputChange}
                                            />
                                        </CCol>
                                        <CCol md={6}>
                                            <CFormLabel htmlFor="validationCustom01">Potência</CFormLabel>
                                            <CInputGroup>
                                                <CButton
                                                    type="button"
                                                    color="secondary"
                                                    variant="ghost"
                                                    id="inputGroupFileAddon03"
                                                    size="sm"
                                                    onClick={handleIncreasePw}
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
                                                    value={getPw}
                                                    readOnly
                                                    required
                                                />
                                                <CButton
                                                    type="button"
                                                    color="secondary"
                                                    variant="ghost"
                                                    id="inputGroupFileAddon03"
                                                    size="sm"
                                                    onClick={handleDecreasePw}
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
                                    <CImage rounded thumbnail src={getImage} style={{ width: '600px', height: '290px', marginTop: '10px' }} />
                                    <CFormLabel htmlFor="exampleFormControlTextarea1">JSON</CFormLabel>
                                    <textarea
                                        className="form-control"
                                        id="exampleFormControlTextarea1"
                                        rows="10"
                                        value={getResponse}
                                        readOnly
                                    ></textarea>
                                </CCol>
                                <CCol xs={12} md={6} className="d-flex flex-column align-items-end" style={{ marginTop: '80px' }}>
                                    <CInputGroup>
                                        <ButtonGroups input={'1'} fonteSize="20px" />
                                        <ButtonGroups input={'2'} fonteSize="20px" />
                                        <ButtonGroups input={'3'} fonteSize="20px" />
                                        <ButtonGroups input={'Pipoca'} fonteSize="10px" onClick={() => handleFetchProgramados(1, ',')} />
                                    </CInputGroup>

                                    <CInputGroup>
                                        <ButtonGroups input={'4'} fonteSize="20px" />
                                        <ButtonGroups input={'5'} fonteSize="20px" />
                                        <ButtonGroups input={'6'} fonteSize="20px" />
                                        <ButtonGroups input={'Leite'} fonteSize="10px" onClick={() => handleFetchProgramados(2, ':')} />
                                    </CInputGroup>

                                    <CInputGroup>
                                        <ButtonGroups input={'7'} fonteSize="20px" />
                                        <ButtonGroups input={'8'} fonteSize="20px" />
                                        <ButtonGroups input={'9'} fonteSize="20px" />
                                        <ButtonGroups input={'Carnes de Boi'} fonteSize="10px" onClick={() => handleFetchProgramados(3, ';')} />
                                    </CInputGroup>

                                    <CInputGroup>
                                        <ButtonGroups input={'Cancela/Pausa'} fonteSize="9px" onClick={handleCancel} />
                                        <ButtonGroups input={'0'} fonteSize="20px" />
                                        <ButtonGroups input={'Iniciar/+30'} fonteSize="12px" onClick={handleInitial} />
                                        <ButtonGroups input={'Frango'} fonteSize="10px" onClick={() => handleFetchProgramados(4, '-')} />
                                    </CInputGroup>

                                    <CInputGroup>
                                        <CRow>
                                            <CCol md={1}>
                                                <div style={{ textAlign: 'center' }}>
                                                    <CButton
                                                        {...bind()}
                                                        type="button"
                                                        color="secondary"
                                                        variant="ghost"
                                                        id="inputGroupFileAddon03"
                                                        onContextMenu={(e) => e.preventDefault()}
                                                        onClick={() => handleFetchProgramados(6, '$')}
                                                        style={{
                                                            height: '50px',
                                                            width: '65px',
                                                            display: 'flex',
                                                            justifyContent: 'center',
                                                            alignItems: 'center',
                                                            backgroundColor: isPressed ? 'darkred' : '#6c7484',
                                                            border: 'none',
                                                            color: 'white',
                                                            padding: 0,
                                                            marginTop: '5px',
                                                            fontSize: '10px',
                                                            fontStyle: 'italic',
                                                            // transition: 'transform 0.2s ease, background-color 0.3s ease',
                                                            transform: isPressed ? 'scale(0.95)' : 'scale(1)',
                                                            transition: 'transform 0.1s ease',
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
                                                        {'Custom 1'}
                                                    </CButton>
                                                    <span style={{ fontSize: '8px', color: 'black', display: 'block', marginTop: '3px', whiteSpace: 'nowrap' }}>
                                                        Press 3s p/ limpar
                                                    </span>
                                                </div>
                                            </CCol>
                                        </CRow>
                                        <CRow>
                                            <CCol md={1}>
                                                <div style={{ textAlign: 'center' }}>
                                                    <CButton
                                                        {...bindButton2()}
                                                        type="button"
                                                        color="secondary"
                                                        variant="ghost"
                                                        id="inputGroupFileAddon03"
                                                        onContextMenu={(e) => e.preventDefault()}
                                                        onClick={() => handleFetchProgramados(7, '@')}
                                                        style={{
                                                            height: '50px',
                                                            width: '65px',
                                                            display: 'flex',
                                                            justifyContent: 'center',
                                                            alignItems: 'center',
                                                            backgroundColor: isPressed2 ? 'darkred' : '#6c7484',
                                                            border: 'none',
                                                            color: 'white',
                                                            padding: 0,
                                                            marginTop: '5px',
                                                            fontSize: '10px',
                                                            fontStyle: 'italic',
                                                            // transition: 'transform 0.2s ease, background-color 0.3s ease',
                                                            transform: isPressed2 ? 'scale(0.95)' : 'scale(1)',
                                                            transition: 'transform 0.1s ease',
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
                                                        {'Custom 2'}
                                                    </CButton>
                                                    <span style={{ fontSize: '8px', color: 'black', display: 'block', marginTop: '3px', whiteSpace: 'nowrap' }}>
                                                        Press 3s p/ limpar
                                                    </span>
                                                </div>
                                            </CCol>
                                        </CRow>
                                        <CRow>
                                            <CCol md={1}>
                                                <div style={{ textAlign: 'center' }}>
                                                    <CButton
                                                        {...bindButton3()}
                                                        type="button"
                                                        color="secondary"
                                                        variant="ghost"
                                                        id="inputGroupFileAddon03"
                                                        onContextMenu={(e) => e.preventDefault()}
                                                        onClick={() => handleFetchProgramados(8, '!')}
                                                        style={{
                                                            height: '50px',
                                                            width: '65px',
                                                            display: 'flex',
                                                            justifyContent: 'center',
                                                            alignItems: 'center',
                                                            backgroundColor: isPressed3 ? 'darkred' : '#6c7484',
                                                            border: 'none',
                                                            color: 'white',
                                                            padding: 0,
                                                            marginTop: '5px',
                                                            fontSize: '10px',
                                                            fontStyle: 'italic',
                                                            // transition: 'transform 0.2s ease, background-color 0.3s ease',
                                                            transform: isPressed3 ? 'scale(0.95)' : 'scale(1)',
                                                            transition: 'transform 0.1s ease',
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
                                                        {'Custom 3'}
                                                    </CButton>
                                                    <span style={{ fontSize: '8px', color: 'black', display: 'block', marginTop: '3px', whiteSpace: 'nowrap' }}>
                                                        Press 3s p/ limpar
                                                    </span>
                                                </div>
                                            </CCol>
                                        </CRow>
                                        {/* <ButtonGroups input={'Custom 1'} fonteSize="10px" fonte={'italic'} onClick={() => handleFetchProgramados(6, '+')} /> */}
                                        {/* <ButtonGroups input={'Custom 2'} fonteSize="10px" fonte={'italic'} onClick={() => handleFetchProgramados(7, '+')} /> */}
                                        {/* <ButtonGroups input={'Custom 3'} fonteSize="10px" fonte={'italic'} onClick={() => handleFetchProgramados(8, '+')} /> */}
                                        <ButtonGroups input={'Feijão'} fonteSize="10px" onClick={() => handleFetchProgramados(5, '+')} />
                                    </CInputGroup>

                                    <CInputGroup>
                                        <CCol md={8}>
                                            <CFormLabel htmlFor="exampleFormControlTextarea1">Aquecimento</CFormLabel>
                                            <textarea className="form-control" id="exampleFormControlTextarea1" rows="10" value={outputString} ></textarea>
                                        </CCol>
                                    </CInputGroup>
                                </CCol>
                            </CRow>
                        </CForm>
                    </CCardBody>
                </CCard>
            </CCol>
        </CRow>
    );
};
