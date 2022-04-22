export async function getCfg() {
    return window.ipc.invoke('getCfg')
}

export async function setCfg(cfg: cfg) {
    return window.ipc.invoke('setCfg', cfg)
}

export async function  relaunchShortcutRegister(){
    return window.ipc.invoke('unregisterAll')
}