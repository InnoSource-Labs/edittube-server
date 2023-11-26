const Workspace = require("../models/workspace");
const { getVerifyURI } = require("../utils/OAuth2");
const {
    getTimeStampString,
    getWorkspaceHasVerification,
} = require("../utils/helper");

const limit = 5;

function getWorkspaceRole(workspace, uid) {
    return workspace.creatorId === uid
        ? "creator"
        : workspace.editors.find((each) => each.uid === uid)
          ? "editor"
          : "none";
}

async function getWorkspaceRoleById(id, uid) {
    const workspace = await Workspace.findById(id);
    return getWorkspaceRole(workspace, uid);
}

function getWorkspaceReadOnly(workspace, uid) {
    const role = getWorkspaceRole(workspace, uid);
    workspace._doc.role = role;

    if (
        role === "creator" &&
        workspace.youtubeSecret &&
        !getWorkspaceHasVerification(workspace.youtubeSecret)
    ) {
        workspace._doc.verifyURL = getVerifyURI(
            workspace.youtubeSecret,
            workspace.id
        );
    } else {
        delete workspace._doc.youtubeSecret;
    }

    return workspace;
}

async function getWorkspaces(uid, filter, page) {
    const isCreator = { creatorId: uid };
    const isEditor = { editors: { $elemMatch: { uid } } };

    const query =
        filter === "creator"
            ? isCreator
            : filter === "editor"
              ? isEditor
              : { $or: [isCreator, isEditor] };

    const workspaces = await Workspace.find(query)
        .sort("-updatedAt")
        .skip((page - 1) * limit)
        .limit(limit);

    const totalresults = await Workspace.countDocuments(query);

    const workspacesReadOnly = workspaces.map((workspace) => {
        return getWorkspaceReadOnly(workspace, uid);
    });

    return {
        currentpage: page,
        workspaces: workspacesReadOnly,
        totalpages: Math.ceil(totalresults / limit),
    };
}

async function addNewWorkspace(workspace, creatorId) {
    const { name, youtubeSecret, editors } = workspace;
    const timestamp = getTimeStampString();

    const newWorkspace = new Workspace({
        name,
        creatorId,
        youtubeSecret: youtubeSecret,
        createdAt: timestamp,
        updatedAt: timestamp,
        editors,
    });
    await newWorkspace.save();

    return {
        status: 201,
        workspace: getWorkspaceReadOnly(newWorkspace, creatorId),
    };
}

async function getOneWorkspace(id, uid) {
    const workspace = await Workspace.findOne({ _id: id });

    if (workspace) {
        return {
            status: 200,
            workspace: getWorkspaceReadOnly(workspace, uid),
        };
    } else {
        return { status: 404, workspace: null };
    }
}

async function editWorkspace(data, id, uid) {
    const verify = (await getWorkspaceRoleById(id, uid)) === "creator";
    if (!verify) {
        return {
            status: 401,
            workspace: null,
        };
    }

    const { name, youtubeSecret, editors } = data;
    const updateObj = { updatedAt: getTimeStampString() };

    if (name) updateObj.name = name;
    if (youtubeSecret) updateObj.youtubeSecret = youtubeSecret;
    if (editors) updateObj.editors = editors;

    const updatedWorkspace = await Workspace.findOneAndUpdate(
        { _id: id },
        updateObj,
        { new: true }
    );

    return {
        status: 200,
        workspace: getWorkspaceReadOnly(
            updatedWorkspace,
            updatedWorkspace.creatorId
        ),
    };
}

async function deleteWorkspace(id, uid) {
    const verify = (await getWorkspaceRoleById(id, uid)) === "creator";
    if (!verify) {
        return 401;
    }
    await Workspace.findOneAndDelete({ _id: id });
    return 200;
}

module.exports = {
    getWorkspaces,
    addNewWorkspace,
    getOneWorkspace,
    editWorkspace,
    deleteWorkspace,
    getWorkspaceRoleById,
};
