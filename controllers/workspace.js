const Workspace = require("../models/workspace");
const { getTimeStampString } = require("../utils/healper");

const limit = 5;

async function getHasWorkspaceOwnership(id, uid) {
    const workspace = await Workspace.findById(id);
    return !!workspace && workspace.creatorId === uid;
}

async function getHasWorkspaceEditorship(id, uid) {
    const workspace = await Workspace.findById(id);
    return !!workspace && !!workspace.editors.find((each) => each.uid === uid);
}

function getWorkspaceReadOnly(workspace, uid) {
    const role = workspace.creatorId === uid ? "creator" : "editor";
    workspace._doc.role = role;

    if (role === "editor") {
        delete workspace._doc.clientId;
        delete workspace._doc.clientSecret;
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
    const { name, clientId, clientSecret, editors } = workspace;
    const timestamp = getTimeStampString();

    const newWorkspace = new Workspace({
        name,
        creatorId,
        clientId,
        clientSecret,
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
    const verify = await getHasWorkspaceOwnership(id, uid);
    if (!verify) {
        return {
            status: 401,
            workspace: null,
        };
    }

    const { name, clientId, clientSecret, editors } = data;
    const updateObj = { updatedAt: getTimeStampString() };

    if (name) updateObj.name = name;
    if (clientId) updateObj.clientId = clientId;
    if (clientSecret) updateObj.clientSecret = clientSecret;
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
    const verify = await getHasWorkspaceOwnership(id, uid);
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
    getHasWorkspaceOwnership,
    getHasWorkspaceEditorship,
};
