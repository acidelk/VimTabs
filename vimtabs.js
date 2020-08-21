const BackgroundCommands = {
  selectNextTab(tabs) { return switchTab("next", tabs); },
  selectPreviousTab(tabs) { return switchTab("previous", tabs); },
  moveTabRight(tabs) { return moveTab("right", tabs); },
  moveTabLeft(tabs) { return moveTab("left", tabs); }
}

var switchTab = function(direction, tabs) {
    var activeTab = tabs.find(tab => tab.active);
    var toSelect =
      (() => { switch (direction) {
        case "next":
          return (activeTab.index + 1) % tabs.length;
        case "previous":
          return ((activeTab.index - 1) + tabs.length) % tabs.length;
      } })();
    chrome.tabs.update(tabs[toSelect].id, {active: true});
};

var moveTab = function (direction, tabs) {
    var activeTab = tabs.find(tab => tab.active);
    var pinnedCount = tabs.filter(tab => tab.pinned).length;
    var left = activeTab.pinned ? 0 : pinnedCount;
    var right = (activeTab.pinned ? pinnedCount : tabs.length) - 1;
    var step = 1;
    if (direction === "left") step = -step
    chrome.tabs.move(activeTab.id, {index: Math.max(left, Math.min(right, activeTab.index + step))});
}
chrome.commands.onCommand.addListener(function (command) {
  chrome.tabs.query({ currentWindow: true }, BackgroundCommands[command]);
});
