function ValueTypeList(inputNodeID, datalistID) {
    this.initialize = function() {
        this.id = datalistID;
        this.inputNode = document.getElementById(inputNodeID);
        this.listNode = document.getElementById(datalistID);
        // A saved curve has the whole value type, a new one only its id.
        if(curve.value_type && typeof curve.value_type === "object") {
            this.inputNode.value = curve.value_type.title;
            curve.value_type = curve.value_type.id;
        } else if(request.value_type) {
            this.inputNode.value = request.value_type.title;
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
