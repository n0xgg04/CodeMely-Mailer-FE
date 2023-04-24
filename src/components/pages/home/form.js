import React, { useState, useRef } from 'react';
import { ToastContainer, toast } from 'react-toastify';

//import 'react-table/react-table.css'
import 'react-toastify/dist/ReactToastify.css';
import './style.scss';
import axios from 'axios'

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputTextarea } from 'primereact/inputtextarea';
import { useFormik } from 'formik';
import { Button } from 'primereact/button';
import { classNames } from 'primereact/utils';
import { Toast } from 'primereact/toast';
import 'primereact/resources/themes/lara-light-indigo/theme.css'


function FormMail() {
    const [isUploading, setIsUploading] = useState(false);
    const [isError, setIsError] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [fileList, setFileList] = useState([]);
    const [emailList, setEmailList] = useState([])
    const [emailListArr, setEmailListArr] = useState([])
    const formRef = useRef(null);
    const [showForm, setShowForm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [justDone, setJustDone] = useState(false)

    const handleButtonClick = () => {
        setShowForm(true);
    };



    const handleFormSubmit = (event) => {
        setJustDone(false)
        event.preventDefault();
        if (isUploading) {
            return;
        }
        setIsUploading(true);
        setIsError(false);
        setIsSuccess(false);
        // setEmailList([])

        const formData = new FormData(formRef.current);
        if (fileList.length > 0) {
            for (let i = 0; i < fileList.length; i++) {
                if (!fileList[i].name.endsWith('.xlsx')) {
                    toast('Không được tải tệp khác excel', {
                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "light",
                    });
                    return;
                }
                formData.append('files[]', fileList[i]);
            }
        }
        fetch(formRef.current.getAttribute('action'), {
            method: formRef.current.getAttribute('method'),
            body: formData,
        })
            .then((response) => {
                setIsUploading(false);
                if (response.status >= 200 && response.status < 400) {
                    setIsSuccess(true);
                    response.json().then(data => {
                        //  console.log(data.valid_email);
                        setEmailList(data.valid_email)
                        let emailOk = data.valid_email
                        var recipients = emailOk.map((email, index) => {
                            return { id: index + 1, email };
                        });
                        setEmailListArr(recipients)
                    }).catch(error => {
                        console.error(error);
                    });


                    console.log(emailListArr);

                    toast.success('Đã tải lên thành công', {
                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "colored",
                    });
                } else {
                    setIsError(true);
                }
            })
            .catch(() => {
                setIsUploading(false);
                setIsError(true);
            });
    };

    const handleInputChange = (event) => {
        setFileList(event.target.files);
        handleFormSubmit(event);
    };

    const handleDrag = (event) => {
        event.preventDefault();
        event.stopPropagation();
    };

    const handleDragIn = (event) => {
        event.preventDefault();
        event.stopPropagation();
        formRef.current.classList.add('is-dragover');
    };

    const handleDragOut = (event) => {
        event.preventDefault();
        event.stopPropagation();
        formRef.current.classList.remove('is-dragover');
    };

    const handleDrop = (event) => {
        event.preventDefault();
        event.stopPropagation();
        formRef.current.classList.remove('is-dragover');
        const dt = event.dataTransfer;
        const files = dt.files;
        setFileList(files);
        handleFormSubmit(event);
    };

    const click = () => {
        setEmailList([])
        setEmailListArr([])
        setShowForm(false)
    }

    const writeMail = () => {
        console.log(emailListArr);
    }

    const [inputValue, setInputValue] = useState('');
    const [inputSubjectValue, setInputSubjectValue] = useState('')

    const handleEmailInputChange = (event) => {
        setInputValue(event.target.value);
    }

    const handleSubjectInputChange = (event) => setInputSubjectValue(event.target.value)

    const sendMail = async () => {
        setLoading(true)
        console.log(inputValue);
        try {
            const response = await axios.post('http://localhost:2222/send', {
                email: emailList,
                content: {
                    subject: inputSubjectValue,
                    text: inputValue
                },
            });
            console.log(response.data);
            setLoading(false)
            setShowForm(false)
            setJustDone(true)
            toast.success('Đã gửi mail thành công', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
            });
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <>
            <ToastContainer />
            <div className="container" role="main">
                <h1>
                    <a href="/article-url"></a>
                </h1>

                <nav role="navigation">
                    <a href="" className="is-selected" style={{ textDecoration: 'none' }} onClick={click}>
                        Tải lên dữ liệu
                    </a>
                </nav>

                {
                    showForm === false ? (
                        emailList.length === 0 ? (
                            <>
                                <form
                                    ref={formRef}
                                    method="post"
                                    action="http://localhost:2222/upload"
                                    encType="multipart/form-data"
                                    noValidate=""
                                    className={`box ${isUploading ? 'is-uploading' : ''} ${isError ? 'is-error' : ''} ${isSuccess ? 'is-success' : ''
                                        } has-advanced-upload`}
                                    onSubmit={handleFormSubmit}
                                    onDrag={handleDrag}
                                    onDragEnter={handleDragIn}
                                    onDragLeave={handleDragOut}
                                    onDragOver={handleDragIn}
                                    onDrop={handleDrop}
                                >
                                    <div className="box__input">
                                        <svg className="box__icon" xmlns="http://www.w3.org/2000/svg" width="50" height="43" viewBox="0 0 50 43">
                                            <path d="M48.4 26.5c-.9 0-1.7.7-1.7 1.7v11.6h-43.3v-11.6c0-.9-.7-1.7-1.7-1.7s-1.7.7-1.7 1.7v13.2c0 .9.7 1.7 1.7 1.7h46.7c.9 0 1.7-.7 1.7-1.7v-13.2c0-1-.7-1.7-1.7-1.7zm-24.5 6.1c.3.3.8.5 1.2.5.4 0 .9-.2 1.2-.5l10-11.6c.7-.7.7-1.7 0-2.4s-1.7-.7-2.4 0l-7.1 8.3v-25.3c0-.9-.7-1.7-1.7-1.7s-1.7.7-1.7 1.7v25.3l-7.1-8.3c-.7-.7-1.7-.7-2.4 0s-.7 1.7 0 2.4l10 11.6z"></path>
                                        </svg>
                                        <input
                                            type="file"
                                            name="files"
                                            id="file"
                                            className="box__file"
                                            data-multiple-caption="{count} files selected"
                                            multiple={true}
                                            onChange={handleInputChange}
                                        />
                                        <label htmlFor="file">
                                            <strong>Tải tệp lên</strong>
                                            <span className="box__dragndrop"> hoặc kéo thả vào đây</span>.
                                        </label>
                                        <button type="submit" className="box__button">
                                            Upload
                                        </button>
                                    </div>

                                    <div className="box__uploading">Đang tải lên...</div>
                                    <div className="box__success">
                                        Done!{' '}
                                        <a href="" className="box__restart" role="button">
                                            Upload more?
                                        </a>
                                    </div>
                                    <div className="box__error">
                                        Lỗi xảy ra! <span></span>.{' '}
                                        <a href="" className="box__restart" role="button">
                                            Thử lại
                                        </a>
                                    </div>
                                    <input type="hidden" name="ajax" value="1" />
                                </form>
                                <strong>Tải lên file excel chứa thông tin email</strong>
                            </>
                        ) : (
                            <>
                                <div className="card">
                                    <DataTable value={emailListArr} stripedRows tableStyle={{ minWidth: '50rem' }}>
                                        <Column field="id" header="#"></Column>
                                        <Column field="email" header="Email"></Column>
                                    </DataTable>
                                </div>
                                <p></p>
                                {justDone === false ? (
                                    <Button label="Tiếp theo" onClick={handleButtonClick} />
                                ) :
                                    (
                                        <Button label="Upload lại" onClick={
                                            () => {
                                                setEmailList([])
                                                setFileList([])
                                                setIsSuccess(false)
                                                setIsError(false)
                                                setIsUploading(false)
                                                setEmailListArr([])
                                                setJustDone(false)
                                                setShowForm(false)
                                            }
                                        } />
                                    )
                                }
                            </>
                        )) : (
                        <>
                            <label htmlFor="subject" style={{ display: "block", marginBottom: "15px" }}>Tiêu đề :</label>
                            <InputTextarea
                                inputId="subject"
                                name="subject"
                                rows={4}
                                cols={30}
                                value={inputSubjectValue}
                                onChange={handleSubjectInputChange}
                                className={classNames({ 'p-invalid': false })}
                            />
                            <p></p>
                            <label htmlFor="content" style={{ display: "block", marginBottom: "15px" }}>Nội dung :</label>
                            <InputTextarea
                                inputId="content"
                                name="content"
                                rows={4}
                                cols={30}
                                value={inputValue}
                                onChange={handleEmailInputChange}
                                className={classNames({ 'p-invalid': false })}
                            />
                            <p></p>
                            <Button label="Submit" loading={loading} onClick={sendMail} type="submit" icon="pi pi-check" style={{ marginTop: "15px" }} />
                        </>
                    )
                }

                <footer>
                    <div>
                    </div>
                </footer >

            </div >
        </>
    );
}

export default FormMail;
