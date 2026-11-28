use tauri::webview::PageLoadEvent;

const EXTERNAL_LINK_HANDLER: &str = r#"
(() => {
  const install = (doc) => {
    if (!doc || !doc.documentElement || doc.documentElement.dataset.tauriExternalLinks) return;
    doc.documentElement.dataset.tauriExternalLinks = 'installed';
    doc.addEventListener('click', (event) => {
      const target = event.target;
      const link = target && typeof target.closest === 'function'
        ? target.closest('a[href]')
        : null;
      if (!link) return;

      const url = new URL(link.href);
      const isHeadway = url.protocol === 'https:' && url.hostname === 'care.headway.co';
      const isEmail = url.protocol === 'mailto:';
      if (!isHeadway && !isEmail) return;

      event.preventDefault();
      window.__TAURI__.opener.openUrl(url.href).catch((error) => {
        console.error('Unable to open external link:', error);
      });
    }, true);

    doc.querySelectorAll('iframe').forEach((frame) => {
      frame.addEventListener('load', () => install(frame.contentDocument));
      if (frame.contentDocument?.readyState === 'complete') {
        install(frame.contentDocument);
      }
    });
  };

  install(document);
})();
"#;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
  tauri::Builder::default()
    .plugin(tauri_plugin_opener::init())
    .on_page_load(|webview, payload| {
      if payload.event() == PageLoadEvent::Finished && webview.label() == "main" {
        if let Err(error) = webview.eval(EXTERNAL_LINK_HANDLER) {
          eprintln!("Failed to install external link handler: {error}");
        }
      }
    })
    .setup(|app| {
      if cfg!(debug_assertions) {
        app.handle().plugin(
          tauri_plugin_log::Builder::default()
            .level(log::LevelFilter::Info)
            .build(),
        )?;
      }
      Ok(())
    })
    .run(tauri::generate_context!())
    .expect("error while building tauri application");
}
