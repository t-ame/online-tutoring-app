
exports.isUserAdmin = (userData) => {
    return userData && userData.roles && userData.roles.filter(role => role == 'Admin').length > 0;
}

exports.isUserTutor = (userData) => {
    return userData && userData.roles && userData.roles.filter(role => role == 'Tutor').length > 0;
}

exports.isUserStudent = (userData) => {
    return userData && userData.roles && userData.roles.filter(role => role == 'Student').length > 0;
}

const apiUrlHead = "/api/v1";

exports.appParams = {
    getApiUrlHead: () => apiUrlHead
};
