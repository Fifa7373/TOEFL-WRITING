/**
 * TOEFL Writing 練習工具 — 資料後端
 * 把整包資料存在一張 Google Sheet 裡，供電腦與手機共用。
 *
 * 部署步驟見 SETUP.md
 */

const SHEET_NAME = 'data';

function getSheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(SHEET_NAME);
  if (!sh) {
    sh = ss.insertSheet(SHEET_NAME);
    sh.getRange('A1').setValue('key');
    sh.getRange('B1').setValue('value');
  }
  return sh;
}

/** 讀取：回傳 { key: value, ... } */
function doGet(e) {
  const sh = getSheet_();
  const last = sh.getLastRow();
  const out = {};
  if (last > 1) {
    const rows = sh.getRange(2, 1, last - 1, 2).getValues();
    rows.forEach(function (r) {
      if (r[0]) out[r[0]] = r[1];
    });
  }
  return ContentService
    .createTextOutput(JSON.stringify(out))
    .setMimeType(ContentService.MimeType.JSON);
}

/** 寫入：body 是 { key: value, ... }，整包覆蓋 */
function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    const incoming = JSON.parse(e.postData.contents);
    const sh = getSheet_();

    // 讀出現有資料，合併後整張重寫
    const last = sh.getLastRow();
    const existing = {};
    if (last > 1) {
      sh.getRange(2, 1, last - 1, 2).getValues().forEach(function (r) {
        if (r[0]) existing[r[0]] = r[1];
      });
    }
    Object.keys(incoming).forEach(function (k) {
      existing[k] = incoming[k];
    });

    const keys = Object.keys(existing);
    sh.clear();
    sh.getRange('A1').setValue('key');
    sh.getRange('B1').setValue('value');
    if (keys.length) {
      const rows = keys.map(function (k) { return [k, existing[k]]; });
      sh.getRange(2, 1, rows.length, 2).setValues(rows);
    }

    return ContentService
      .createTextOutput(JSON.stringify({ ok: true, saved: keys.length }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}
