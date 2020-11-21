import React, {useState} from 'react';
import './ReactRegister.css';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import bandera from '../../images/bandera-lateral.png';
import cheffer from '../../images/cheffer-inicio.png';
import TextError from './TextError.jsx';
import axios from "axios";

const initialValues = { name: '',
                        lastname: '',
                        username: '',
                        email: '',
                        password: '',
                        confirmPassword: '',
                        picture: '',
                        country: '',
                        description: '' }

const validationSchema = Yup.object({
    name: Yup.string().required('Required'),
    lastname: Yup.string().required('Required'),
    username: Yup.string().required('Required'),
    email: Yup.string().email('Invalid email format').required('Required'),
    password: Yup.string().required('Required'),
    confirmPassword: Yup.string().oneOf([Yup.ref('password'), ''], 'Passwords don\'t match').required('Required'),
    country: Yup.string().required('Required') 
})



export default function ReactRegister() {
    const [errors, setErrors] = useState([])
    const onSubmit = values => { 
        axios({
            url: '/users',
            method: 'post',
            data: values
        })
        .then(response => {
            const user = response.data;
            window.location.href = `/users/${user.id}`
        })
        .catch(error => {
            if (error.response) {
                setErrors(error.response.data)
            }
        })
     }
    return (
        <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit} validateOnMount handleOnClick handleImageUpload>
        {formik => {
        return(
        // <div className='App'>
            <div className='mainjsx'>
            <div className='alignmentjsx'>
                <div id='banderajsx'>
                    <img src={bandera} width="40" height="1000"/>
                </div>
                <div id='recuadro'>
                    <div className='boxjsx'>
                        <div className='cheffer-written'> <img src={cheffer} width="100" height="50" /> </div>
                        <Form> 
                            {errors.map((error, index) => <p key={index}>{error.message}</p>)}  
                            <div className="form-control">     
                                <label htmlFor="name">Name:</label>
                                <Field type="text" name="name" id="name"/>
                                <ErrorMessage name='name' component={TextError} />
                            </div>  

                            <div className="form-control">  
                                <label htmlFor="lastname">Lastname:</label>
                                <Field type="text" name="lastname" id="lastname"/>
                                <ErrorMessage name='lastname' component={TextError}/>
                            </div>

                            <div className="form-control">  
                                <label htmlFor="username">Username:</label>
                                <Field type="text" name="username" id="username"/>
                                <ErrorMessage name='username' component={TextError} />
                            </div>

                            <div className="form-control"> 
                                <label htmlFor="email">Email:</label>
                                <Field type="email" name="email" id="email" />
                                <ErrorMessage name='email' component={TextError} />
                            </div>

                            <div className="form-control"> 
                                <label htmlFor="password">Password:</label>
                                <Field type="password" name="password" id="password"/>
                                <ErrorMessage name='password' component={TextError}/>
                            </div>

                            <div className="form-control"> 
                                <label htmlFor="confirmPassword">Confirm Password:</label>
                                <Field type="password" name="confirmPassword" />
                                <ErrorMessage name='confirmPassword' component={TextError}/>
                            </div>
                            {/* <div className="form-control">
                                <label htmlFor="picture" >Profile picture:</label>
                                <input type="file" name="picture" id="picture"/>
                            </div> */}
                            <div className="form-control">
                                <label htmlFor="country">Country: </label>
                                <Field type="text" name="country" id="country"/>
                                <ErrorMessage name='country' component={TextError}/>
                            </div>

                            <div className="form-control">
                                <label htmlFor="description">Description: </label>
                                <Field as="textarea" name="description" id="description"/>
                            </div>


                            <button type="submit" disabled={!formik.isValid}>Submit</button>

                    </Form>
                    </div> {/*cierre box*/}
                </div> {/*cierre recuadro*/}
                <div className='fillerjsx'> </div>
            </div>
            </div>
            // </div>
        )}}  
        </Formik>
        
    )
}