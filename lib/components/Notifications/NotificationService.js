const notifications = [];

export const GETNOTIFICATIONS = function () {
  return notifications;
};

/**
 * Create a standard toast notification
 * @param {{title: string, body?: string, type?: string, icon?: string, img?: string}} notification
 */
export const toast = function toast(notification) {
  if (!notification) {
    return;
  }
  if (Array.isArray(notification)) {
    return notification.map(n => toast(n));
  }
  notification.id = getId();
  notifications.push(notification);
};

/**
 * Creates an Error Toast
 * @param {string} msg
 * @param {string} icon
 * @param {string} title
 */
export const toastError = function (msg, icon = "fa-times", title = "Error") {
  toast({ title, body: msg, type: "danger", icon });
};

/**
 * Creates a Success Toast
 * @param {string} msg
 * @param {string} icon
 * @param {string} title
 */
export const toastSuccess = function (msg, icon = "fa-bell", title = "Success") {
  toast({ title, body: msg, type: "success", icon });
};

/**
 * Creates a Warning Toast
 * @param {string} msg
 * @param {string} icon
 * @param {string} title
 */
export const toastWarning = function (msg, icon = "fa-exclamation-triangle", title = "Warning") {
  toast({ title, body: msg, type: "warning", icon });
};

/**
 * Creates an Info Toast
 * @param {string} msg
 * @param {string} icon
 * @param {string} title
 */
export const toastInfo = function (msg, icon = "fa-comment", title = "Info") {
  toast({ title, body: msg, type: "info", icon });
};

function getId() {
  return `QID${Math.floor(Math.random() * 1000000)}_${Math.floor(
    Math.random() * 1000000
  )}`;
}
