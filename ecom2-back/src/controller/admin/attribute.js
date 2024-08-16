const Attribute = require('../../models/attribute')

exports.getAttr = (req, res) => {
    Attribute.find()
        .then(attributes => {
            res.status(200).json({ success: true, attributes })
        })
        .catch(err => {
            console.log(err);
            res.status(400).json({ error: "something went wrong" })
        })

}
exports.create = (req, res) => {
    const { name, values } = req.body
    if(!name){
        res.status(400).json({ error: "Name is required" })
    }
    let _attribute = new Attribute({
        name,
        values
    })
    _attribute.save()
        .then(attribute => {
            res.status(201).json({ success: true, attribute })
        })
        .catch(err => {
            console.log(err);
            res.status(400).json({ error: "something went wrong" })
        })
}
exports.update = (req, res) => {
    const _id = req.params.id
    const { name, values } = req.body
    if(!name){
        res.status(400).json({ error: "Name is required" })
    }
    let attributeData = {
        name,
        values
    }
    Attribute.findByIdAndUpdate(_id, { $set: attributeData }, { new: true })
        .then(attribute => {
            res.status(201).json({ success: true, attribute })
        })
        .catch(err => {
            console.log(err);
            res.status(400).json({ error: "something went wrong" })
        })
}
exports.deleteAttr = (req, res) => {
    const _id = req.params.id
    Attribute.findByIdAndDelete(_id)
        .then(attr => {
            res.status(200).json({ success: true })
        })
        .catch(err => {
            console.log(err);
            res.status(400).json({ error: "something went wrong" })
        })
}