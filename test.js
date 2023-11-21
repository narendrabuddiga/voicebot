const commonUtils = xdp.getModule("../interfaces/commonUtils");
const util = xdp.getModule("../utils/importWfIns");
const instanceMacrosCol = config.mongodb.collection("instanceMacroformfields");
const codeset = config.mongodb.collection("codeset");
const codesetvalue = config.mongodb.collection("codesetvalue");

const prePareRecord = (wfInsID, value, cb) => {
    let record = {
        workflowName: "Nonconformance",
        workflowInstanceId: wfInsID,
        fields: []
    };
    record.fields.push({ name: "@ncincdevid", value: value, valueName: value });
    util.importSingleWorkflow(record, (err, status) => {
        return cb(null, null);
    });
};


const getLastinst = (contextInstId, type,incidentType, cb) => {
    let find = {
        $and: [{ workflowid: "5abb2df7c2dce8e79fdba506" }, { isdeleted: false },
        {
            "macroformfields": {
                "$elemMatch": { "macroname": "@invenitemtype", "macrovaluename": type }
            }
        }, {
            workflowinstanceid: { $ne: contextInstId }
        }
        ]
    };
    if(incidentType){
      find["$and"].push( {
        "macroformfields": {
            "$elemMatch": { "macroname": "@invenitemtype", "macrovaluename": incidentType }
        }
    })
    }
    instanceMacrosCol.find(find).sort({ _id: -1 }).limit(1, (err, wfIns) => {
        config.loginfo("------------wfIns" + JSON.stringify(wfIns));
        if (err || !wfIns || wfIns.length === 0) {
            return cb(1,"");
        }
        let lastCatagory = config.utils.getMacroValue(wfIns[0], "@inventoryid", "valuename");
        let id = 0;
        let year="";
        if (lastCatagory) {
            let prevId = lastCatagory.split("-")[1];
            id=prevId.split("/")[0];
            year=prevId.split("/")[1];
        }
        return cb(Number(id) + 1,year);
    });
};

const nonconformanceId = (cb) => {
    config.loginfo("context >>>>>>>> " + JSON.stringify(context));
    let contextInstId = context.workflowInstanceId;
    if (!contextInstId) {
        contextInstId = context.instanceMacro.workflowinstanceid;
    }
    instanceMacrosCol.findOne({ workflowinstanceid: contextInstId, isdeleted: false }, (err, wfIns) => {
        let len;
        config.loginfo("err >>>>>>>> " + err);
        if (err || !wfIns) {
            return cb(err, null);
        }
        let type = config.utils.getMacroValue(wfIns, "@ncdetectiontype", "valuename");
        let incidentType="";
        if(type.toLowerCase()==="incident"){
            incidentType = config.utils.getMacroValue(wfIns, "@cdhinctype", "valuename");
        }
        config.loginfo("type >>>>>>>> " + type);
        getLastinst(contextInstId, type,incidentType, (lastId,preIdYear) => {
            config.loginfo("lastId >>>>>>>> " + lastId);
            if (!lastId) {
                lastId = 1;
            }
            len = lastId.toString().length;
            let code="";
            if(type){
                if (type.toLowerCase() !== "deviation") code="PD";
                else if (type.toLowerCase() === "incident" && incidentType &&
                incidentType.toLowerCase()==="quality impacting incident"){
                 code="QII";
                }else if (type.toLowerCase() === "incident" && incidentType
                 &&incidentType.toLowerCase()==="quality non impacting incident"){
                    code="QNI";
                } 
            }  
                let year = (new Date().getFullYear().toString()).slice(-2);
                if(preIdYear&&Number(preIdYear)<Number(year)){
                    lastId=1;
                }
                lastId = len < 2 ? "00" + lastId : len < 3 ? "0" + lastId : lastId;
              
                let value = code+"-"+lastId+"/"+year;
                config.loginfo("value >>>>>>>> " + value);
                prePareRecord(contextInstId, value, (err, update) => {
                    return cb(null, "Process Completed");
                });
            });
        });
};

nonconformanceId((err, matrixData) => {
    evaluate(matrixData ? matrixData : { error: err || "Could not read template data" });
})

let year = new Date().getFullYear().toString().slice(-2);
if (department) {
  if (department.toLowerCase() === "warehouse") value = "RN" + value;
  else if (department.toLowerCase() === "warehouse")
    value = code + "/" + lastId + "/" + year;
  else if (department.toLowerCase() === "warehouse")
    value = code + "/" + lastId + "/" + year;
  else if (department.toLowerCase() === "warehouse")
    value = code + "/" + lastId + "/" + year;
}