const { error } = require("console");
const Workspace = require("../../models/workspace");

let limit = 3;

async function getAllWorkspaces(uid, page) {
    try {
        let workspaces = await Workspace.find({
            $or: [{ creatorId: uid }, { editorIds: uid }],
        })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        let totalresults = await Workspace.countDocuments({
            $or: [{ creatorId: uid }, { editorIds: uid }],
        });

        workspaces = workspaces.map((workspace) => {
            workspace = {
                workspace,
                role: workspace.creatorId === uid ? "creator" : "editor",
            };
            return workspace;
        });

        return {
            totalresults,
            currentpage: page,
            totalpages: Math.ceil(totalresults / limit),
            workspaces,
        };
    } catch (error) {
        throw new error(error.message);
    }
}

async function getCreatorWorkspaces(uid, page) {
    try {
        let workspaces = await Workspace.find({ creatorId: uid })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        let totalresults = await Workspace.countDocuments({ creatorId: uid });

        workspaces = workspaces.map((workspace) => {
            workspace = {
                workspace,
                role: "creator",
            };
            return workspace;
        });

        return {
            totalresults,
            currentpage: page,
            totalpages: Math.ceil(totalresults / limit),
            workspaces,
        };
    } catch (error) {
        throw new error(error.message)
    }
}

async function getEditorWorkspaces(uid, page) {
    try {
        let workspaces = await Workspace.find({ editorIds: uid })
            .limit(limit * 1)
            .skip((page - 1) * limit);
        let totalresults = await Workspace.countDocuments({ editorIds: uid });

        workspaces = workspaces.map((workspace) => {
            workspace = {
                workspace,
                role: "editor",
            };
            return workspace;
        });

        return {
            totalresults,
            currentpage: page,
            totalpages: Math.ceil(totalresults / limit),
            workspaces,
        };
    }
    catch {
        throw new error(error.message)
    }
}

module.exports = {
    getAllWorkspaces,
    getCreatorWorkspaces,
    getEditorWorkspaces,
};
