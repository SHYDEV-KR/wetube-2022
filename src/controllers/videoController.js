import Video from "../models/Video";

export const home = (req, res) => {
    console.log(1)
    Video.find({}, (error, videos) => {
        console.log(3);
        return res.render("home", { pageTitle: "Home", videos });
    })
    console.log(2);
};

export const watch = (req, res) => {
    const { id } = req.params;
    return res.render("watch", { pageTitle: `Watching` })
};

export const getEdit = (req, res) => {
    const { id } = req.params;
    return res.render("edit", { pageTitle : `Editing` });
}

export const postEdit = (req, res) => {
    const { id } = req.params;
    const { title } = req.body;
    return res.redirect(`/videos/${id}`);
};

export const getUpload = (req, res) => {
    return res.render("upload", {pageTitle : "Upload Video"});
}

export const postUpload = (req, res) => {
    const { title } = req.body;
    return res.redirect("/");
}