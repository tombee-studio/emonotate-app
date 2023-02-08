function ValueTypeList(inputNodeID, datalistID) {
    this.initialize = function() {
        this.id = datalistID;
        this.inputNode = document.getElementById(inputNodeID);
        this.listNode = document.getElementById(datalistID);
        if(curve.value_type != undefined) {
            let value_type = curve.value_type;
            this.inputNode.value = curve.value_type.title;
            curve.value_type = value_type.id;
        }
        this.inputNode.addEventListener("input", function(ev) {
            while (this.listNode.firstChild) {
                this.listNode.removeChild(this.listNode.firstChild);
            }
            let value = ev.target.value;

            fetch(`/api/valuetypes/?format=json&search=${value}`)
                .then(res => res.json())
                .then(data => {
                    for(var item of data.models) {
                        let optionNode = document.createElement("li");
                        optionNode.setAttribute("class", "autocomplete");
                        optionNode.setAttribute("data-autocomplete", item.id);
                        optionNode.setAttribute("data-target", item.title);
                        optionNode.appendChild(document.createTextNode(`${item.title}`));
                        this.listNode.appendChild(optionNode);
                    }
                });
        }.bind(this));
    }.bind(this);
}
