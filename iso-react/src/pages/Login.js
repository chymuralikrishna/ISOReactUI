import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { RadioButton } from 'primereact/radiobutton';
import { Toast } from 'primereact/toast';
import { ProgressSpinner } from 'primereact/progressspinner';
import Apiservice from '../api/Apiservice';


class Login extends Component {

    constructor(props) {
        super(props)

        this.handleLogin = this.handleLogin.bind(this)
        this.onChangeUserName = this.onChangeUserName.bind(this)
        this.onChangePassword = this.onChangePassword.bind(this)

        this.showError = this.showError.bind(this)

        this.state = {
            userName: '',
            password: '',
            message: '',
            ecNo: '',
            isoAuditorLogin: false,
            isoLogin: false,
            plantLogin: false,
            isLoading: false
        }

    }

    showError() {
        this.toast.show({ severity: 'error', summary: 'Invalid Credentials', detail: 'Login using your FUSION credentials', life: 3000 })
    }
    showError2() {
        this.toast.show({ severity: 'error', summary: 'Select a login option', detail: 'Please select proper login option', life: 3000 })
    }
    serverError() {
        this.toast.show({ severity: 'error', summary: 'Restricted Access', Life: 3000 })
    }

    onChangeUserName(e) {
        this.setState({ userName: e.target.value })
    }

    onChangePassword(e) {
        this.setState({ password: e.target.value })
    }

    handleLogin(e) {
        e.preventDefault();
        if (this.state.plantLogin === false && this.state.isoLogin === false && this.state.isoAuditorLogin === false) {
            this.showError2()
            this.props.history.push("/");
        } else {

            this.setState({
                isLoading: true,
                // show:false
            })
            Apiservice.login(this.state.userName, this.state.password).then(
                (res) => {
                    this.setState({
                        isLoading: false,
                        // show:false
                    })
                    if (res.data.ecno === '' || res.data.ecno === 0) {
                        this.showError()
                    } else if (res.data.ecno !== '') {
                        if (this.state.plantLogin === true) {
                            localStorage.setItem("type", "PLANT");
                        } else if (this.state.isoAuditorLogin === true) {
                            localStorage.setItem("type", "ISO AUDITOR");
                        } else if (this.state.isoLogin === true) {
                            localStorage.setItem("type", "ISO INCHARGE");
                        }
                        localStorage.setItem("ecNo", res.data.ecno);
                        //localStorage.setItem("name", res.data.name);
                        this.state.ecNo = localStorage.getItem("ecNo")
                        Apiservice.loginOption(this.state.ecNo, this.state.isoAuditorLogin, this.state.isoLogin, this.state.plantLogin).then(
                            (result) => {
                                this.setState({
                                    isLoading: false,
                                    //show:false
                                })
                                if (result.data === true) {
                                    //console.log(result)
                                    this.props.history.push('/dashboard', {});
                                    // window.location.reload()
                                } else {
                                    this.serverError()
                                    //alert("Server Error");
                                }
                            }
                        )
                        Apiservice.getUserDetails(this.state.ecNo).then(
                            res => {
                                localStorage.setItem("user", res.data.userName);
                                //localStorage.setItem("designation", res.data.designation);
                                localStorage.setItem("grade", res.data.grade);
                                localStorage.setItem("unitCode", res.data.unitCode);
                                localStorage.setItem("plantDescription", res.data.plantDescription);
                            }
                        )
                    }
                }
            )
        }
    }

    render() {

        const header = <img alt="nfc logo" src="images/nfc.png" />

        const loggedIn = localStorage.getItem('token')

        if (loggedIn != null) {
            return <Redirect to='/dashboard' />
        }
        else {

            return (
                <React.Fragment>
                    <div className=" bg-login">
                        <Toast ref={(el) => this.toast = el} />
                        <div className="loginBox p-d-flex p-jc-center p-mt-6  ">
                            <div className="p-d-flex p-flex-column p-flex-md-row p-shadow-6 loginBox">
                                <div className="FloginCard">
                                    <div className="p-col-12">
                                        <div className="icon-img">
                                            <img src="images/iso_logo.png" alt="iso logo" />
                                        </div>
                                        <span>ISO Management System</span>
                                        <div className="scroll-txt">
                                            <marquee direction="left" behavior="scroll" scrollamount="3">
                                                Note: Kindly login with FUSION Username and Password.
                                            </marquee>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <form className="p-fluid" onSubmit={this.handleLogin}>
                                        <div className="loginCard">
                                            {header}
                                            <div className="p-col-12">
                                                <div className="p-formgroup-inline">
                                                    <div className="p-field-radiobutton">
                                                        <RadioButton inputId="plantLogin" name="plantLogin"
                                                            value={('true' === 'true')}
                                                            onChange={(e) => this.setState({ plantLogin: e.target.value, isoLogin: false, isoAuditorLogin: false })}
                                                            checked={this.state.plantLogin === true} />
                                                        <label htmlFor="plant">Plant</label>
                                                    </div>
                                                    <div className="p-field-radiobutton">
                                                        <RadioButton inputId="isoAuditorLogin" name="isoAuditorLogin"
                                                            value={('true' === 'true')}
                                                            onChange={(e) => this.setState({ isoAuditorLogin: e.target.value, plantLogin: false, isoLogin: false })}
                                                            checked={this.state.isoAuditorLogin === true} />
                                                        <label htmlFor="ISO Auditor">ISO Auditor</label>
                                                    </div>
                                                    <div className="p-field-radiobutton">
                                                        <RadioButton inputId="isoLogin" name="isoLogin"
                                                            value={('true' === 'true')}
                                                            onChange={(e) => this.setState({ isoLogin: e.target.value, plantLogin: false, isoAuditorLogin: false })}
                                                            checked={this.state.isoLogin === true} />
                                                        <label htmlFor="ISO">ISO Incharge</label>
                                                    </div>
                                                </div>
                                                <div className="p-inputgroup">
                                                    <span className="p-inputgroup-addon">
                                                        <i className="pi pi-user"></i>
                                                    </span>
                                                    <InputText name="userName" type="text" placeholder="username"
                                                        required="required"
                                                        value={this.state.userName} onChange={this.onChangeUserName} />
                                                </div>
                                            </div>
                                            <div className="p-col-12">
                                                <div className="p-inputgroup">
                                                    <span className="p-inputgroup-addon">
                                                        <i className="pi pi-eye-slash"></i>
                                                    </span>
                                                    <InputText name="password" type="password" placeholder="password"
                                                        value={this.state.password} onChange={this.onChangePassword}
                                                        required="required" />
                                                </div>
                                            </div>
                                            <div className="p-col-12">
                                                <Button label="Login" type="submit" />
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                    {this.state.isLoading ? <div className="spinnerDialog"><ProgressSpinner animationDuration="0.5s" /></div> : ""}
                </React.Fragment>
            )
        }
    }
}

export default Login;