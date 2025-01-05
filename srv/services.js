const cds = require('@sap/cds')

class ProcessorService extends cds.ApplicationService {

    init() {
        /* Register Event Handlers*/
        this.before('UPDATE', 'Incidents', (request) => this.onUpdate(request));
        this.before('CREATE', 'Incidents', (request) => this.changeUrgencyDueToSubject(request.data));
        return super.init();
    }

    /* Custom Validation */
    async onUpdate(request) {
        request.data;
        const status_code = request.data.status_code;
        if (status_code === 'C') {
            return request.reject('Can not modify closed incident');
        }
    }

    changeUrgencyDueToSubject(data) {
        if (data) {
            const incidents = Array.isArray(data) ? data : [data];
            incidents.forEach((incident) => {
                if(incident.title?.toLowerCase().includes("urgent")) {
                    incident.urgency = { code: "H" , descr: "High"};
                }
            });
        }
    }

}

module.exports = {ProcessorService}