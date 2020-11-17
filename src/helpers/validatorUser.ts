interface hashTable{
    [key:string]:string
}


export const validateRegister = (usename:string, email:string, password:string) => {
    let errors:hashTable = {};

    if(usename.trim()==='') errors.username = 'username must not be empty';

    if(email.trim()==='') errors.email = 'email must not be empty'; 

    if(password.trim()==='') errors.password = 'password must not be empty';

    return {errors, valid: Object.keys(errors).length==0}
}

export const validateLogin = (email:string, password:string) => {
    let errors:hashTable = {};
    
    if(email.trim()==='') errors.email = 'email must not be empty'; 

    if(password.trim()==='') errors.password = 'password must not be empty';

    return {errors, valid: Object.keys(errors).length==0}
}