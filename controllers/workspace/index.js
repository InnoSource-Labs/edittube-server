const Workspace = require("../../models/workspace");
const { getTimeStampString } = require("../../utils");

const limit = 5;

function getWorkspaceReadOnly(workspace, uid) {
    const role = workspace.creatorId === uid ? "creator" : "editor";

    workspace._doc.role = role;
    delete workspace._doc.clientId;
    delete workspace._doc.clientSecret;

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

async function addNewWorkspace(workspace) {
    const { creatorId, name, clientId, clientSecret, editors } = workspace;
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

async function editWorkspace(data, id) {
    const { name, clientId, clientSecret, editors } = data;
    const timestamp = getTimeStampString();

    const updatedWorkspace = await Workspace.findOneAndUpdate(
        { _id: id },
        {
            name,
            clientId,
            clientSecret,
            updatedAt: timestamp,
            editors,
        },
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

async function deleteWorkspace(id) {
    await Workspace.findOneAndDelete({ _id: id });
    return;
}

module.exports = {
    getWorkspaces,
    getOneWorkspace,
    addNewWorkspace,
    editWorkspace,
    deleteWorkspace,
};
