const usersMiddleware = require('../middleware/users');
const contentsMiddleware = require('../middleware/content');

const report = async(req, res) => {
    let report_type = req.query.type;
    let user_id = req.headers.user;
    let data = req.body;
    switch(report_type) {
        case 'post':
            res.json(await reportContent(data, user_id));
            break;
        case 'user':
            res.json(await reportUser(data, user_id));
            break;
        default: break;
    }
}

const reportContent = async(report_data, user_report) => {
    let content = await contentsMiddleware.getSingleContent(report_data.id);
    let content_report = content.report || [];
    content_report.push({user_report, description: report_data.description, reportDate: new Date()});
    console.log(content_report);
    let response = await contentsMiddleware.update(content._id, {report: content_report});
    return response;
}

const reportUser = async(report_data, user_report) => {
    let user = await usersMiddleware.getUser(report_data.id);
    let user_rep = user.report;
    user_rep.push({user_report, description: report_data.description, reportDate: new Date()});
    let response = await usersMiddleware.updateUser(user._id, {report: user_rep});
    return response;
}

module.exports = {
    report
}
