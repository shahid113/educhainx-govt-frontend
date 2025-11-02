import api from './axiosInstance';

export const login=(username, password)=>{
    return api.post('/api/government/login', {
        username, password
    })
}

export const getProfile=()=>{
    return api.get('/api/government/profile');
}

export const logout=()=>{
    return api.post('/api/government/logout');
}

export const getInstitutes=(status='')=>{
    const params=status?{status}:{};
    return api.get('/api/government/get-institute', {params});
}

export const approveInsititute=(id, walletAddress)=>{
    return api.put('/api/government/approve-institute', {id, walletAddress})
}

export const revokeInstitute=(id, walletAddress)=>{
    return api.put('/api/government/revoke-institute', {id, walletAddress})
}

export const addInstitute=(instituteData)=>{
    console.log(instituteData)
   return api.post('/api/government/add-institute', instituteData)
}