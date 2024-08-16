
const cloudinary = require('cloudinary')

const getImages=(list)=>{
  let data =[]
  list.map(image=>{
    data.push({
      _id:image.public_id,
      size:image.bytes,
      fileName:image.filename+"."+image.format,
      // createdAt: new Date(image.uploaded_at),
      thumbnailUrl:image.secure_url
    })
  })
  return data
}

exports.getImages = (req, res) => {
  cloudinary.v2.search
  .sort_by('uploaded_at','desc')
  .max_results(100)
  .execute().then(async(results)=>{
    res.json({data:getImages(results.resources) })
  })
  .catch(err=>{
    console.log(err);
  })

};

exports.uploadMedia=(req,res)=>{
  const file = req.file
  if(file.path){
    let data ={
      _id:file.path.split("/")[file.path.split("/").length-1].split(".")[0],
      size:file.size,
      fileName:file.originalname,
      thumbnailUrl:file.path
    }
    //console.log(data);
    res.status(200).json({data})
  }
 
}


exports.deleteMedia=(req,res)=>{
let id = req.params.id
  cloudinary.v2.uploader.destroy(id, function (error, result) {
    if(error)return res.status(400).json({error:"error occured"})
    res.status(200).json({ success: true })
});
}
