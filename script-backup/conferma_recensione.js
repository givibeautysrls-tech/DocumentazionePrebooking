let table = base.getTable("Recensioni e Referral")
const record = await input.recordAsync("Record cliccato", table);
let clienteID = record?.getCellValue("Cliente")[0].id
let clientiTable = base.getTable("Clienti")
let cliente = await clientiTable.selectRecordAsync(clienteID||"")
let id = cliente?.getCellValueAsString("KeapID")


let workerURL = new URL("https://applytags.notifichegielvi.workers.dev/")
workerURL.searchParams.append("keapID", id || "")
workerURL.searchParams.append("tagIDs", "155")


let response = await remoteFetchAsync(workerURL.toString())

if (!response.ok){
    console.log("ERRORE")
    return 
}
console.log("Recensione registrata, premio in arrivo...")

setField(clientiTable, clienteID, "Recensione Inviata", true)

/**
* @param {any} table
* @param {any} recordID
* @param {String} name
* @param {any} value
*/
async function setField(table, recordID, name, value) {
    await table.updateRecordAsync(recordID, {
        [name]: value
    });
}




