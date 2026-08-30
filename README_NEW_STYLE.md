# SIGMA-MD New Style

- Commands are split by category under `plugins/`.
- Plugin loading is recursive.
- Command lookup uses an index for fast pattern/alias resolution.
- Menus are generated from registered commands, so menus stay in sync.
- `.menu`, `.groupmenu`, `.funmenu`, `.settingmenu` are lightweight text menus.
- `.private on/off`, `.public`, `.admin on/off` are included.
- Group toggles include `.antilink`, `.antispam`, `.antibadword`, `.antibot`, `.antidelete`, `.antihijack`, `.protect`, `.welcome`, `.goodbye`.
- Set real credentials in environment variables; do not commit secrets.
