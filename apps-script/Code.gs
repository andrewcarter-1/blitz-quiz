/**
 * Cooper Quiz – Google Drive helper
 * Runs in the family Google account and stores quizzes in a "Cooper Quiz" Drive folder.
 * The quiz site talks to it; nobody has to sign in to Google. Every request must carry the passcode.
 */
const PASSCODE = 'CHANGE-ME';          // <-- pick your family passcode (keep the quotes)
const FOLDER_NAME = 'Cooper Quiz';
const EXT = '.cooperquiz.json';

function doGet() {
  return out_({ ok: true, app: 'cooper-quiz' });
}

function doPost(e) {
  let req;
  try { req = JSON.parse(e.postData.contents); } catch (err) { return out_({ error: 'bad request' }); }
  if (PASSCODE === 'CHANGE-ME' || req.passcode !== PASSCODE) { Utilities.sleep(1500); return out_({ error: 'passcode' }); }
  const lock = LockService.getScriptLock();
  lock.waitLock(25000);
  try {
    const folder = folder_();
    switch (req.action) {
      case 'list': {
        const files = [];
        const it = folder.getFiles();
        while (it.hasNext()) {
          const f = it.next();
          if (f.getName().slice(-EXT.length) !== EXT) continue;
          let m = {};
          try { m = JSON.parse(f.getDescription() || '{}'); } catch (x) {}
          files.push({ id: f.getId(), name: f.getName(), cqid: m.cqid || '', updated: m.updated || 0 });
        }
        return out_({ files: files, folderUrl: folder.getUrl() });
      }
      case 'get': {
        const f = fileIn_(folder, req.id);
        if (!f) return out_({ error: 'Quiz not found in Drive' });
        return out_({ data: f.getBlob().getDataAsString('UTF-8') });
      }
      case 'save': {
        const meta = JSON.stringify({ cqid: String(req.cqid || ''), updated: Number(req.updated) || Date.now() });
        let f = req.id ? fileIn_(folder, req.id) : null;
        if (!f && req.cqid) f = findByQuizId_(folder, String(req.cqid));
        const blob = Utilities.newBlob(String(req.content || ''), 'application/json', String(req.name || 'quiz' + EXT));
        if (f && String(req.content || '').length < 9500000) {
          // Update in place (setContent handles up to 10 MB)
          f.setContent(String(req.content || ''));
          f.setName(String(req.name || f.getName()));
          f.setDescription(meta);
          return out_({ id: f.getId() });
        }
        if (f) f.setTrashed(true); // very large quiz: replace the file instead
        const created = folder.createFile(blob);
        created.setDescription(meta);
        return out_({ id: created.getId() });
      }
      case 'trash': {
        const f = fileIn_(folder, req.id);
        if (f) f.setTrashed(true);
        return out_({ ok: true });
      }
    }
    return out_({ error: 'unknown action' });
  } catch (err) {
    return out_({ error: String(err && err.message || err) });
  } finally {
    lock.releaseLock();
  }
}

function folder_() {
  const props = PropertiesService.getScriptProperties();
  const id = props.getProperty('folderId');
  if (id) {
    try { const f = DriveApp.getFolderById(id); if (!f.isTrashed()) return f; } catch (x) {}
  }
  const it = DriveApp.getFoldersByName(FOLDER_NAME);
  let folder = null;
  while (it.hasNext()) { const f = it.next(); if (!f.isTrashed()) { folder = f; break; } }
  if (!folder) folder = DriveApp.createFolder(FOLDER_NAME);
  props.setProperty('folderId', folder.getId());
  return folder;
}

function fileIn_(folder, id) {
  if (!id) return null;
  try {
    const f = DriveApp.getFileById(String(id));
    if (f.isTrashed()) return null;
    const parents = f.getParents();
    while (parents.hasNext()) if (parents.next().getId() === folder.getId()) return f;
  } catch (x) {}
  return null;
}

function findByQuizId_(folder, cqid) {
  const it = folder.getFiles();
  while (it.hasNext()) {
    const f = it.next();
    try { if (JSON.parse(f.getDescription() || '{}').cqid === cqid) return f; } catch (x) {}
  }
  return null;
}

function out_(o) {
  return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
}

/** Run this once from the editor (select "setup" → Run) to approve Drive access and create the folder. */
function setup() {
  const f = folder_();
  Logger.log('Cooper Quiz folder: ' + f.getUrl());
}
