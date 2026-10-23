(() => {
  const ROOT = new URL('.', document.currentScript?.src || location.href).pathname.replace(/\/$/, '');
  const internal = path => `${ROOT}${path}`;
  const LOGO = internal('/ominao-logo.png');
  const page = () => {
    const pathname = ROOT && location.pathname.startsWith(ROOT)
      ? location.pathname.slice(ROOT.length)
      : location.pathname;
    return pathname.replace(/\/+$/, '') || '/';
  };
  const dot = color => `<span class="cat-dot" style="background:${color}"></span>`;
  const nav = (href, label, color, external = false) =>
    `<li><a href="${external ? href : internal(href)}"${external ? ' target="_blank" rel="noreferrer"' : ''}>${dot(color)}${label}</a></li>`;

  function setHead() {
    const titles = {
      '/': 'Ominao — Private Execution Network',
      '/nodes': 'Relay Network — Ominao',
      '/docs': 'Integration — Ominao'
    };
    document.title = titles[page()] || titles['/'];
    const copy = 'Ominao is a privacy-native Solana fork for confidential MCP calls, private settlement and verifiable agent execution.';
    const fields = [
      ['name', 'description', copy],
      ['property', 'og:title', document.title],
      ['property', 'og:description', copy],
      ['name', 'twitter:title', document.title],
      ['name', 'twitter:description', copy]
    ];
    for (const [attr, key, value] of fields) {
      let meta = document.querySelector(`meta[${attr}="${key}"]`);
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute(attr, key);
        document.head.append(meta);
      }
      meta.content = value;
    }
    document.querySelectorAll('link[rel~="icon"]').forEach(node => node.remove());
    const favicon = document.createElement('link');
    favicon.rel = 'icon';
    favicon.type = 'image/png';
    favicon.href = LOGO;
    document.head.append(favicon);
  }

  function renderShell() {
    const current = page();
    const header = document.querySelector('.d-header');
    if (header && header.dataset.ominao !== current) {
      header.dataset.ominao = current;
      header.innerHTML = `
        <a class="header-logo" href="${internal('/')}"><img src="${LOGO}" width="30" height="30" alt="Ominao"><span>Ominao</span></a>
        <div class="header-actions">
          <a class="header-social" href="https://x.com/ominaocoin" target="_blank" rel="noreferrer" aria-label="Ominao on X">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.724-8.83L1.254 2.25H8.08l4.26 5.662L18.244 2.25Zm-1.161 17.52h1.833L7.084 4.126H5.117l11.966 15.644Z"></path></svg>
          </a>
          <button class="header-ca is-pending" type="button" data-ca="TBA" aria-label="Contract address not live">
            <span class="ca-label"><i></i>CA</span>
            <span class="ca-value"><code>TBA</code><small>NOT LIVE</small></span>
            <span class="ca-copy" aria-hidden="true"><svg viewBox="0 0 20 20"><rect x="6.5" y="5.5" width="9" height="10" rx="1"></rect><path d="M4.5 13V4.5h8"></path></svg></span>
          </button>
        </div>`;
    }

    const sidebar = document.querySelector('.sidebar');
    if (sidebar && sidebar.dataset.ominao !== current) {
      sidebar.dataset.ominao = current;
      sidebar.innerHTML = `
        <a class="wordmark" href="${internal('/')}"><img class="wordmark-logo" src="${LOGO}" width="32" height="32" alt=""><span class="wordmark-name">Ominao</span></a>
        <nav class="side-nav" aria-label="Site">
          <div class="side-group"><p class="side-label">Protocol</p><ul>
            ${nav('/', 'Overview', '#b1cf5a')}
            ${nav('/#routing', 'Private routing', '#35c68f')}
            ${nav('/#views', 'What the chain sees', '#4ca7d8')}
            ${nav('/#fork', 'The Solana fork', '#8d83df')}
            ${nav('/#privacy', 'Monero privacy model', '#d37eb6')}
            ${nav('/#parameters', 'Parameters', '#d6bb58')}
            ${nav('/#risks', 'Risks', '#ce655f')}
          </ul></div>
          <div class="side-group"><p class="side-label">Network</p><ul>
            ${nav('/nodes', 'Relay set', '#dd884e')}
            ${nav('/docs', 'MCP integration', '#53b7aa')}
            ${nav('/docs#rpc', 'Private RPC', '#689ad3')}
          </ul></div>
          <div class="side-group"><p class="side-label">Upstream</p><ul>
            ${nav('https://github.com/anza-xyz/agave', 'Agave', '#9277cf', true)}
            ${nav('https://github.com/modelcontextprotocol/modelcontextprotocol', 'MCP specification', '#ca728c', true)}
            ${nav('https://github.com/monero-project/research-lab', 'Monero Research Lab', '#e18d4f', true)}
          </ul></div>
        </nav>`;
      const activeHref = internal(current === '/nodes' ? '/nodes' : current === '/docs' ? '/docs' : '/');
      sidebar.querySelector(`a[href="${activeHref}"]`)?.classList.add('is-active');
    }

    const footer = document.querySelector('.foot');
    if (footer && footer.dataset.ominao !== current) {
      footer.dataset.ominao = current;
      footer.innerHTML = `<a class="wordmark wordmark-sm" href="${internal('/')}"><img class="wordmark-logo" src="${LOGO}" width="24" height="24" alt="">Ominao</a><span class="foot-note">Solana execution · Monero privacy constraints · MCP tools · OIP-001</span>`;
    }
  }

  const postHeader = (title, category, spec, extra = '') => `
    <header class="thread-head">
      <h1 class="fancy-title">${title}</h1>
      <div class="topic-category"><span class="badge-category" style="--category-badge-color:#b1cf5a"><span class="badge-category-name">${category}</span></span><nav class="thread-pages" aria-label="Pages"><span class="is-current">1</span></nav></div>
    </header>
    <div class="post">
      <div class="topic-avatar"><img src="${LOGO}" width="45" height="45" alt=""></div>
      <div class="post-body"><div class="topic-meta"><span class="username">Ominao</span><span class="post-note">${spec} · October 23, 2026${extra ? ` · ${extra}` : ''}</span></div><div class="cooked">`;
  const postEnd = '</div></div></div>';

  function architectureFigure() {
    return `<figure class="anatomy-card" id="architecture">
      <figcaption><span><b>FIG 01</b> Ominao privacy routing engine</span><span class="figure-readout"><i></i> ROUTE SEALED · 5/8 ATTESTED</span></figcaption>
      <svg class="machine" viewBox="0 0 920 455" role="img" aria-label="An isometric privacy routing machine showing capability admission, three relay drums, MCP execution, a receipt gauge and confidential settlement.">
        <defs>
          <linearGradient id="baseTop" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#1b3921"/><stop offset="1" stop-color="#0b1b0f"/></linearGradient>
          <linearGradient id="moduleTop" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#b9d85f"/><stop offset="1" stop-color="#718f3b"/></linearGradient>
          <linearGradient id="moduleFront" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#6c8c3b"/><stop offset="1" stop-color="#344d27"/></linearGradient>
          <filter id="softGlow"><feGaussianBlur stdDeviation="4" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
          <pattern id="vent" width="8" height="8" patternUnits="userSpaceOnUse"><path d="M1 1h5" stroke="#759553" stroke-width="1"/></pattern>
        </defs>
        <g class="machine-shadow"><ellipse cx="458" cy="390" rx="360" ry="32"/></g>
        <g class="machine-base">
          <polygon points="90,300 562,176 836,292 365,417" fill="url(#baseTop)"/>
          <polygon points="90,300 365,417 365,438 90,321" fill="#07110a"/>
          <polygon points="365,417 836,292 836,313 365,438" fill="#0b1a0e"/>
          <path d="M126 306L374 407M789 290L374 407" class="seam"/>
          <g class="base-feet"><path d="M118 326v24l24 10v-24z"/><path d="M348 424v22l24-6v-21z"/><path d="M786 312v22l24-7v-22z"/><path d="M567 365v20l22-6v-20z"/></g>
          <g class="fasteners"><circle cx="127" cy="304" r="4"/><circle cx="367" cy="405" r="4"/><circle cx="793" cy="292" r="4"/><circle cx="565" cy="207" r="4"/><circle cx="205" cy="329" r="3"/><circle cx="290" cy="365" r="3"/><circle cx="458" cy="383" r="3"/><circle cx="650" cy="331" r="3"/></g>
        </g>
        <g class="input-tray">
          <polygon points="108,260 202,235 254,257 160,282" fill="#152c19"/>
          <polygon points="160,282 254,257 254,292 160,317" fill="#0a160c"/>
          <polygon points="108,260 160,282 160,317 108,295" fill="#0d2011"/>
          <rect x="128" y="270" width="36" height="8" rx="2" transform="rotate(23 128 270)" class="slot"/>
          <circle cx="140" cy="292" r="3" class="lamp live"/><circle cx="151" cy="297" r="3" class="lamp"/>
        </g>
        <g class="relay relay-a" transform="translate(252 188)">
          <polygon points="0,56 84,34 132,54 48,77" fill="url(#moduleTop)"/><polygon points="48,77 132,54 132,124 48,148" fill="url(#moduleFront)"/><polygon points="0,56 48,77 48,148 0,127" fill="#273d22"/>
          <ellipse cx="70" cy="68" rx="22" ry="9" class="rotor"/><ellipse cx="70" cy="68" rx="9" ry="4" class="rotor-core"/><path d="M70 59v18M49 68h42" class="rotor-mark"/>
          <rect x="58" y="95" width="58" height="27" rx="2" fill="url(#vent)"/><circle cx="61" cy="133" r="3" class="lamp live"/><circle cx="75" cy="129" r="3" class="lamp"/>
          <g class="bolts"><circle cx="10" cy="63" r="2"/><circle cx="39" cy="76" r="2"/><circle cx="58" cy="82" r="2"/><circle cx="121" cy="64" r="2"/></g>
        </g>
        <g class="relay relay-b" transform="translate(425 143)">
          <polygon points="0,56 84,34 132,54 48,77" fill="url(#moduleTop)"/><polygon points="48,77 132,54 132,124 48,148" fill="url(#moduleFront)"/><polygon points="0,56 48,77 48,148 0,127" fill="#273d22"/>
          <ellipse cx="70" cy="68" rx="22" ry="9" class="rotor"/><ellipse cx="70" cy="68" rx="9" ry="4" class="rotor-core"/><path d="M70 59v18M49 68h42" class="rotor-mark"/>
          <rect x="58" y="95" width="58" height="27" rx="2" fill="url(#vent)"/><circle cx="61" cy="133" r="3" class="lamp live"/><circle cx="75" cy="129" r="3" class="lamp live"/>
          <g class="bolts"><circle cx="10" cy="63" r="2"/><circle cx="39" cy="76" r="2"/><circle cx="58" cy="82" r="2"/><circle cx="121" cy="64" r="2"/></g>
        </g>
        <g class="relay relay-c" transform="translate(598 188)">
          <polygon points="0,56 84,34 132,54 48,77" fill="url(#moduleTop)"/><polygon points="48,77 132,54 132,124 48,148" fill="url(#moduleFront)"/><polygon points="0,56 48,77 48,148 0,127" fill="#273d22"/>
          <ellipse cx="70" cy="68" rx="22" ry="9" class="rotor"/><ellipse cx="70" cy="68" rx="9" ry="4" class="rotor-core"/><path d="M70 59v18M49 68h42" class="rotor-mark"/>
          <rect x="58" y="95" width="58" height="27" rx="2" fill="url(#vent)"/><circle cx="61" cy="133" r="3" class="lamp live"/><circle cx="75" cy="129" r="3" class="lamp live"/>
          <g class="bolts"><circle cx="10" cy="63" r="2"/><circle cx="39" cy="76" r="2"/><circle cx="58" cy="82" r="2"/><circle cx="121" cy="64" r="2"/></g>
        </g>
        <g class="cables">
          <path d="M212 267C240 260 237 241 263 237M377 259C405 251 407 208 436 201M550 214C579 220 584 249 610 252M730 270C766 275 775 258 804 269" class="cable"/>
          <path d="M210 276C240 279 241 267 265 260M379 277C408 274 410 235 438 225M552 238C580 240 585 270 612 278" class="cable cable-dim"/>
          <circle cx="212" cy="267" r="6" class="collar"/><circle cx="263" cy="237" r="6" class="collar"/><circle cx="377" cy="259" r="6" class="collar"/><circle cx="436" cy="201" r="6" class="collar"/><circle cx="550" cy="214" r="6" class="collar"/><circle cx="610" cy="252" r="6" class="collar"/><circle cx="730" cy="270" r="6" class="collar"/>
          <circle class="signal signal-one" cx="0" cy="0" r="5"/><circle class="signal signal-two" cx="0" cy="0" r="4"/>
        </g>
        <g class="receipt-gauge">
          <path d="M400 334l92-24 56 24-93 25z" fill="#122817"/><path d="M455 359l93-25v33l-93 25z" fill="#09140b"/><path d="M400 334l55 25v33l-55-25z" fill="#0c1c10"/>
          <ellipse cx="470" cy="340" rx="32" ry="19" fill="#061009" stroke="#91c878"/><path d="M470 340l18-10" class="needle"/><circle cx="470" cy="340" r="4" class="pivot"/>
          <g class="gauge-ticks"><path d="M443 340l-7-1M448 328l-6-5M461 321l-2-7M477 321l3-7M490 329l6-5M497 340l7-1"/></g>
        </g>
        <g class="output-stack">
          <polygon points="752,222 823,203 865,221 794,240" fill="#9fbd52"/><polygon points="794,240 865,221 865,291 794,310" fill="#3f5e2c"/><polygon points="752,222 794,240 794,310 752,292" fill="#243b20"/>
          <rect x="808" y="250" width="41" height="27" rx="2" fill="#07120a" stroke="#91c878"/><path d="M815 263h26M815 269h18" class="screen-line"/>
          <circle cx="809" cy="291" r="3" class="lamp live"/><circle cx="822" cy="288" r="3" class="lamp live"/><circle cx="835" cy="284" r="3" class="lamp"/>
        </g>
        <g class="callouts">
          <path d="M157 242L103 188H42" class="callout-line"/><circle cx="157" cy="242" r="8"/><text x="157" y="246">1</text>
          <path d="M497 169L497 104H424" class="callout-line"/><circle cx="497" cy="169" r="8"/><text x="497" y="173">2</text>
          <path d="M687 235L760 156H842" class="callout-line"/><circle cx="687" cy="235" r="8"/><text x="687" y="239">3</text>
          <path d="M490 340L586 385H672" class="callout-line"/><circle cx="490" cy="340" r="8"/><text x="490" y="344">4</text>
        </g>
      </svg>
      <div class="figure-legend"><span><b>01</b> one-time capability enters</span><span><b>02</b> relays shuffle fixed-size ciphertexts</span><span><b>03</b> gateway opens only the MCP layer</span><span><b>04</b> quorum seals execution receipt</span></div>
      <div class="figure-foot"><span>Hover the machine to trace the sealed request</span><span>Public output: nullifier + commitment + receipt</span></div>
    </figure>`;
  }

  function boundaryFigure() {
    return `<figure class="protocol-map">
      <figcaption><b>FIG 02</b><span>Knowledge is divided by role</span><em>No component receives all four fields</em></figcaption>
      <div class="boundary-grid">
        <div class="boundary-source"><small>PRIVATE INPUT</small><strong>Agent</strong><code>identity · prompt · funds</code></div>
        <div class="boundary-lanes">
          <div><span class="lane-index">A</span><b>Entry</b><i>origin</i><i>next hop</i><s>tool</s><s>provider</s></div>
          <div><span class="lane-index">B</span><b>Mix</b><i>batch</i><i>adjacent hops</i><s>origin</s><s>payload</s></div>
          <div><span class="lane-index">C</span><b>Gateway</b><i>tool call</i><i>provider</i><s>identity</s><s>funding</s></div>
          <div><span class="lane-index">D</span><b>Validator</b><i>proof</i><i>nullifier</i><s>prompt</s><s>result</s></div>
        </div>
        <div class="boundary-output"><small>PUBLIC OUTPUT</small><strong>Receipt</strong><code>valid · final · unlinkable</code></div>
      </div>
    </figure>`;
  }

  function lifecycleFigure() {
    return `<figure class="sequence-figure">
      <figcaption><b>FIG 03</b><span>Private call lifecycle</span><em>one capability · one route · one settlement</em></figcaption>
      <div class="sequence-head"><span>Agent</span><span>Relay set</span><span>Gateway</span><span>MCP server</span><span>Chain</span></div>
      <svg viewBox="0 0 900 330" role="img" aria-label="Sequence of a private MCP call from capability creation through confidential settlement.">
        <g class="lifelines"><path d="M90 14v300M270 14v300M450 14v300M630 14v300M810 14v300"/></g>
        <g class="sequence-arrows">
          <path d="M90 48H258"/><path d="M252 42l12 6-12 6"/>
          <path d="M270 96H438"/><path d="M432 90l12 6-12 6"/>
          <path d="M450 144H618"/><path d="M612 138l12 6-12 6"/>
          <path d="M630 192H462"/><path d="M468 186l-12 6 12 6"/>
          <path d="M450 240H798"/><path d="M792 234l12 6-12 6"/>
          <path d="M810 288H102"/><path d="M108 282l-12 6 12 6"/>
        </g>
        <g class="sequence-labels"><text x="174" y="40">01 capability + proof</text><text x="354" y="88">02 shuffled ciphertext</text><text x="534" y="136">03 tools/call</text><text x="546" y="184">04 encrypted result</text><text x="624" y="232">05 aggregate receipt</text><text x="455" y="280">06 finality + one-time settlement</text></g>
        <g class="sequence-dots"><circle cx="90" cy="48" r="5"/><circle cx="270" cy="96" r="5"/><circle cx="450" cy="144" r="5"/><circle cx="630" cy="192" r="5"/><circle cx="450" cy="240" r="5"/><circle cx="810" cy="288" r="5"/></g>
      </svg>
    </figure>`;
  }

  function networkFigure() {
    return `<figure class="network-figure">
      <figcaption><b>FIG N1</b><span>Epoch relay topology</span><em>independent operators · threshold receipt</em></figcaption>
      <svg viewBox="0 0 900 400" role="img" aria-label="Ominao network topology separating ingress, mix, execution and witness planes.">
        <defs><filter id="nodeGlow"><feGaussianBlur stdDeviation="5" result="g"/><feMerge><feMergeNode in="g"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>
        <g class="topology-zones"><rect x="28" y="48" width="178" height="300" rx="5"/><rect x="238" y="48" width="218" height="300" rx="5"/><rect x="488" y="48" width="178" height="300" rx="5"/><rect x="698" y="48" width="174" height="300" rx="5"/></g>
        <g class="zone-labels"><text x="48" y="78">INGRESS PLANE</text><text x="258" y="78">MIX PLANE</text><text x="508" y="78">EXECUTION</text><text x="718" y="78">WITNESS PLANE</text></g>
        <g class="topology-links"><path d="M126 142C186 142 216 116 284 116M126 142C186 142 216 198 284 198M126 258C186 258 216 198 284 198M126 258C186 258 216 280 284 280"/><path d="M326 116C382 116 408 158 538 158M326 198C390 198 426 158 538 158M326 280C390 280 426 242 538 242"/><path d="M580 158C646 158 664 120 744 120M580 158C646 158 664 186 744 186M580 242C646 242 664 252 744 252M580 242C646 242 664 318 744 318"/></g>
        <g class="topology-nodes">
          <g transform="translate(126 142)"><circle r="28"/><circle r="17"/><path d="M-8 0h16M0-8v16"/></g><g transform="translate(126 258)"><circle r="28"/><circle r="17"/><path d="M-8 0h16M0-8v16"/></g>
          <g transform="translate(306 116)"><circle r="22"/><circle r="8"/></g><g transform="translate(306 198)"><circle r="22"/><circle r="8"/></g><g transform="translate(306 280)"><circle r="22"/><circle r="8"/></g>
          <g transform="translate(558 158)"><rect x="-29" y="-23" width="58" height="46" rx="4"/><path d="M-17-9h34M-17 0h24M-17 9h29"/></g><g transform="translate(558 242)"><rect x="-29" y="-23" width="58" height="46" rx="4"/><path d="M-17-9h34M-17 0h24M-17 9h29"/></g>
          <g transform="translate(765 120)"><path d="M0-25l24 14v27L0 30l-24-14v-27z"/><circle r="7"/></g><g transform="translate(765 186)"><path d="M0-25l24 14v27L0 30l-24-14v-27z"/><circle r="7"/></g><g transform="translate(765 252)"><path d="M0-25l24 14v27L0 30l-24-14v-27z"/><circle r="7"/></g><g transform="translate(765 318)"><path d="M0-25l24 14v27L0 30l-24-14v-27z"/><circle r="7"/></g>
        </g>
        <g class="topology-packet"><circle r="6"><animateMotion dur="6s" repeatCount="indefinite" path="M126 142C186 142 216 198 306 198C390 198 426 158 558 158C646 158 664 186 765 186"/></circle></g>
      </svg>
      <div class="network-legend"><span><i class="shape entry"></i>Entry relays know origin only</span><span><i class="shape mix"></i>Mix relays shuffle a batch</span><span><i class="shape gateway"></i>Gateways open the MCP layer</span><span><i class="shape witness"></i>Witnesses attest commitments</span></div>
    </figure>`;
  }

  function pageIndex(current) {
    const sets = {
      '/': [
        ['architecture', 'Architecture'],
        ['routing', 'Private route'],
        ['invariants', 'Invariants'],
        ['views', 'Public state'],
        ['mechanism', 'Lifecycle'],
        ['fork', 'Solana fork'],
        ['privacy', 'Privacy model'],
        ['record', 'Record anatomy'],
        ['parameters', 'Parameters'],
        ['risks', 'Limits']
      ],
      '/nodes': [
        ['topology', 'Topology'],
        ['roles', 'Node roles'],
        ['boundaries', 'Boundaries'],
        ['rotation', 'Rotation'],
        ['faults', 'Fault response'],
        ['rpc', 'Private RPC'],
        ['operations', 'Operations']
      ],
      '/docs': [
        ['integration-flow', 'Call flow'],
        ['capabilities', 'Capabilities'],
        ['rpc', 'Private RPC'],
        ['transport', 'MCP transport'],
        ['receipts', 'Receipts'],
        ['settlement', 'Settlement'],
        ['errors', 'Errors'],
        ['hygiene', 'Client hygiene']
      ]
    };
    const items = sets[current] || sets['/'];
    return `<aside class="page-index" aria-label="On this page"><p>ON THIS PAGE</p><ol>${items.map(([id, label], index) => `<li><a href="#${id}"><span>${String(index + 1).padStart(2, '0')}</span>${label}</a></li>`).join('')}</ol><div class="index-state"><i></i> OIP REFERENCE</div></aside>`;
  }

  function premiumArchitectureFigure() {
    return `<figure class="anatomy-card premium-architecture" id="architecture">
      <figcaption><span><b>FIG 01</b> Ominao private execution instrument</span><span class="figure-readout"><i></i> ROUTE SEALED · 5/8 ATTESTED</span></figcaption>
      <div class="machine-stage">
        <img src="${internal('/ominao-machine.svg')}" alt="A precision isometric privacy execution instrument with a capability cartridge, three relay rotor modules, a threshold receipt gauge and an isolated MCP output cabinet.">
        <div class="machine-spec"><span>REV <b>OIP-001</b></span><span>DEPTH <b>03</b></span><span>COHORT <b>08</b></span><span>QUORUM <b>05</b></span></div>
      </div>
      <div class="figure-legend premium-legend"><span><b>01 · ADMISSION</b>One-time capability cartridge and membership proof</span><span><b>02 · MIX ROTORS</b>Fixed-size ciphertexts cross independently selected relays</span><span><b>03 · EXECUTION</b>Final layer opens only inside the isolated MCP gateway</span><span><b>04 · RECEIPT</b>Five witness shares seal the committed result</span></div>
      <div class="figure-foot"><span>Move across the instrument to inspect its assemblies</span><span>Public output: nullifier · fee commitment · receipt</span></div>
    </figure>`;
  }

  function premiumRouteConsole() {
    return `<div class="route-console" id="routing">
      <div class="route-console-head"><span><b>LIVE TRACE</b> Private MCP call</span><span><i></i> ENVELOPE 7F2A · EPOCH 8421</span></div>
      <div class="trace-rail" aria-label="A sealed request passes from the agent through entry and mix relays to an execution gateway and MCP provider.">
        <div class="trace-node agent"><small>00</small><b>AGENT</b><em>sealed locally</em></div><i class="trace-link"><u></u></i>
        <div class="trace-node"><small>01</small><b>ENTRY</b><em>origin only</em></div><i class="trace-link"><u></u></i>
        <div class="trace-node"><small>02</small><b>MIX</b><em>batch 24</em></div><i class="trace-link"><u></u></i>
        <div class="trace-node"><small>03</small><b>GATEWAY</b><em>tool layer</em></div><i class="trace-link"><u></u></i>
        <div class="trace-node provider"><small>04</small><b>MCP</b><em>policy 91C4</em></div>
      </div>
      <div class="trace-body">
        <div class="trace-log"><p><span>00.000</span><b>capability</b><em>membership proof accepted</em></p><p><span>00.014</span><b>packet</b><em>32 KiB padded envelope</em></p><p><span>01.208</span><b>shuffle</b><em>position hidden inside cohort</em></p><p><span>04.811</span><b>execute</b><em>tools/call forwarded</em></p><p><span>07.436</span><b>receipt</b><em>5 of 8 shares aggregated</em></p></div>
        <div class="route-control"><label for="route-depth">Relay depth <output id="route-output">3 hops</output></label><input id="route-depth" type="range" min="1" max="6" value="3"><p>Increasing depth separates more network observations while adding one relay latency per hop.</p></div>
      </div>
      <div class="route-readouts"><span><small>ANONYMITY FLOOR</small><b>24 calls</b></span><span><small>ROUTE SPACE</small><b>192 paths</b></span><span><small>FINALITY TARGET</small><b>&lt;9 seconds</b></span><span><small>RECEIPT</small><b>5 / 8</b></span></div>
    </div>`;
  }

  function home() {
    return `<article class="thread">
      ${postHeader('Private execution for agents without a public activity graph.', 'Protocol', 'OIP-001', 'Solana execution · Monero privacy · MCP tools')}
      <p class="dek">Ominao is a privacy-native Solana fork for autonomous agents. It combines SVM execution with Monero-inspired one-time destinations, confidential values, full-set membership proofs and view keys. Agents can call MCP servers without exposing a reusable identity, request metadata or payment graph.</p>
      <div class="pitch-actions"><a class="btn btn-solid btn-lg" href="${internal('/docs')}">Read the integration spec</a><a class="btn-ghost" href="#routing">Trace a private call</a></div>
      <div class="protocol-strip"><span><small>RUNTIME</small>SVM-compatible</span><span><small>PRIVACY SET</small>all eligible outputs</span><span><small>TRANSPORT</small>MCP over sealed relays</span><span><small>FINALITY</small>threshold receipt</span></div>

      ${premiumArchitectureFigure()}

      <div class="instrument ominao-route" id="routing">
        <figure class="scope"><figcaption class="scope-cap"><span class="scope-title">Route of one MCP call</span><span class="scope-live">PRIVATE ROUTE · THRESHOLD 5-OF-8</span></figcaption>
          <svg viewBox="0 0 920 278" role="img" aria-label="An encrypted MCP request crosses three independently selected relays before reaching a tool provider.">
            <rect class="zone" x="126" y="30" width="650" height="176" rx="3"></rect>
            <text class="lab-sm" x="126" y="22">EPHEMERAL RELAY COHORT · ONE CALL · ONE ROUTE</text>
            <path class="wire" d="M84 118 C158 118 196 70 276 70 M84 118 C158 118 196 118 276 118 M84 118 C158 118 196 166 276 166"></path>
            <path class="wire" d="M294 70 C370 70 392 166 472 166 M294 118 C370 118 392 118 472 118 M294 166 C370 166 392 70 472 70"></path>
            <path class="wire" d="M490 70 C566 70 588 118 668 118 M490 118 C566 118 588 166 668 166 M490 166 C566 166 588 70 668 70"></path>
            <path class="wire-hot" d="M60 118 L84 118 L285 70 L481 166 L677 118 L858 118"></path>
            <rect class="hop" x="34" y="103" width="52" height="30" rx="2"></rect><text class="lab-key" x="60" y="123" text-anchor="middle">AGENT</text>
            <circle class="hop" cx="285" cy="70" r="9"></circle><circle class="packet" cx="285" cy="70" r="3.2"></circle>
            <circle class="hop-npc" cx="285" cy="118" r="9"></circle><circle class="hop-npc" cx="285" cy="166" r="9"></circle>
            <circle class="hop-npc" cx="481" cy="70" r="9"></circle><circle class="hop-npc" cx="481" cy="118" r="9"></circle><circle class="hop" cx="481" cy="166" r="9"></circle><circle class="packet" cx="481" cy="166" r="3.2"></circle>
            <circle class="hop-npc" cx="677" cy="70" r="9"></circle><circle class="hop" cx="677" cy="118" r="9"></circle><circle class="packet" cx="677" cy="118" r="3.2"></circle><circle class="hop-npc" cx="677" cy="166" r="9"></circle>
            <rect class="hop" x="836" y="103" width="54" height="30" rx="2"></rect><text class="lab-key" x="863" y="123" text-anchor="middle">MCP</text>
            <text class="lab-sm" x="285" y="228" text-anchor="middle">ENTRY</text><text class="lab-sm" x="481" y="228" text-anchor="middle">MIX</text><text class="lab-sm" x="677" y="228" text-anchor="middle">GATEWAY</text>
          </svg>
        </figure>
        <div class="control"><label for="route-depth">Relay depth</label><input id="route-depth" type="range" min="1" max="6" value="3"><output id="route-output">3 hops</output><p class="control-note">Each hop separates network origin from the execution gateway. Cohorts rotate by epoch.</p></div>
        <div class="readouts"><div><strong>24</strong><span>minimum batch</span></div><div><strong>192</strong><span>route combinations</span></div><div><strong>&lt;9s</strong><span>settlement target</span></div><div><strong>5/8</strong><span>receipt quorum</span></div></div>
      </div>

      <section class="band statement"><h2>The server verifies the right to call. It never learns the caller.</h2><div class="omni-columns"><div><b>Capability</b><p>A one-time token proves scope, expiry and fee without carrying an account identifier.</p></div><div><b>Route</b><p>Layered encryption gives every relay only its previous and next hop.</p></div><div><b>Receipt</b><p>A threshold receipt proves execution against a committed request and output.</p></div></div></section>

      <section class="band" id="invariants"><h2 class="sec-h">Protocol invariants</h2><p class="sec-lede">These properties are consensus and client requirements. A deployment that breaks one of them is not conformant with OIP-001.</p><div class="invariant-grid"><article><span>INV-01</span><h3>No reusable caller identifier</h3><p>Capabilities, return keys and settlement destinations are single-use and independently derived.</p></article><article><span>INV-02</span><h3>No cleartext route</h3><p>Every relay decrypts exactly one layer and cannot identify both ends of the circuit.</p></article><article><span>INV-03</span><h3>No value creation</h3><p>Confidential commitments preserve balance and range without revealing amounts.</p></article><article><span>INV-04</span><h3>No receipt without quorum</h3><p>Execution becomes final only when the epoch threshold signs the same input/output tuple.</p></article><article><span>INV-05</span><h3>No capability replay</h3><p>Nullifiers are ordered before execution and remain permanently spent after finality.</p></article><article><span>INV-06</span><h3>Auditing without spending</h3><p>Scoped view keys reveal selected records while spend authority remains offline.</p></article></div></section>

      <section class="band"><h2 class="sec-h">One system, four deliberately incomplete views</h2><p class="sec-lede">Privacy comes from preventing any normal role from assembling identity, intent, execution and payment into one record.</p>${boundaryFigure()}</section>

      <section class="band" id="views"><h2 class="sec-h">What the chain sees</h2><p class="sec-lede">Ominao publishes enough state to reject replay and conserve value. Caller identity, tool arguments and provider destination remain outside the public graph.</p>
        <div class="views"><div class="view"><h3>Transient route state <span>90s</span></h3><dl><dt>Capability</dt><dd>one-time commitment</dd><dt>Ingress</dt><dd>first relay only</dd><dt>Tool</dt><dd>encrypted identifier</dd><dt>Payload</dt><dd>padded ciphertext</dd><dt>Output</dt><dd>content commitment</dd></dl></div><div class="view is-public"><h3>Permanent chain state</h3><dl><dt>Nullifier</dt><dd>spent</dd><dt>Fee</dt><dd>conservation proof</dd><dt>Receipt</dt><dd>quorum accepted</dd><dt>Caller</dt><dd class="redacted">hidden</dd><dt>Provider</dt><dd class="redacted">hidden</dd></dl></div></div>
      </section>

      <section class="band" id="mechanism"><h2 class="sec-h">From intent to verified result</h2><div class="steps"><div><span>01</span><h3>Sign a capability</h3><p>The agent commits to server, tool, fee ceiling, expiry and a fresh nullifier.</p></div><div><span>02</span><h3>Enter a cohort</h3><p>The request is padded, onion-encrypted and mixed with calls in the same window.</p></div><div><span>03</span><h3>Execute and attest</h3><p>The gateway forwards standard MCP transport. Witnesses sign the request/output commitment.</p></div><div><span>04</span><h3>Settle once</h3><p>The provider receives confidential value at a one-time destination; the nullifier prevents replay.</p></div></div></section>

      <section class="band"><h2 class="sec-h">Call lifecycle</h2><p class="sec-lede">Authorization, transport, execution evidence and value settlement use separate keys but resolve to one receipt commitment.</p>${lifecycleFigure()}<div class="annotation-list"><div><b>Before admission</b><p>The client verifies the epoch relay set, pads the payload and builds the route locally.</p></div><div><b>During execution</b><p>Only the selected gateway and MCP provider process tool arguments. Intermediate relays see ciphertext.</p></div><div><b>After finality</b><p>Call-level routing state expires; the chain retains the nullifier and receipt commitment.</p></div></div></section>

      <section class="band" id="fork"><h2 class="sec-h">The Solana fork</h2><p class="sec-lede">Ominao keeps Solana's parallel execution model, then changes the surfaces that expose identity and flow.</p><div class="change-table"><div class="table-head">Area</div><div class="table-head">Ominao change</div><div class="table-head">Reason</div><div>Runtime</div><div>Privacy precompiles and receipt verification</div><div>Keep proofs cheap enough for agent-scale calls</div><div>Scheduler</div><div>Encrypted call batches and ordered nullifier checks</div><div>Reduce timing and replay leakage</div><div>Networking</div><div>Relay ingress separate from validator gossip</div><div>Do not publish the caller's network edge</div><div>Fees</div><div>Pedersen commitments with conservation proofs</div><div>Hide value while preserving accounting</div><div>RPC</div><div>View-key-scoped reads and oblivious lookup paths</div><div>Avoid rebuilding a public wallet graph off-chain</div></div></section>

      <section class="band"><h2 class="sec-h">System layers</h2><p class="sec-lede">Privacy is enforced across the complete path. Encrypting transport alone would still leave authorization, execution evidence and payment linkable.</p><div class="layer-stack"><article><span>04</span><div><small>APPLICATION</small><h3>MCP tools and agent policies</h3><p>Unmodified tool discovery and <code>tools/call</code> semantics behind a provider adapter.</p></div><b>arguments encrypted to provider</b></article><article><span>03</span><div><small>EXECUTION</small><h3>SVM programs and receipt verifier</h3><p>Nullifier ordering, confidential fee conservation and threshold receipt validation.</p></div><b>deterministic public checks</b></article><article><span>02</span><div><small>PRIVACY</small><h3>Membership, commitments and view keys</h3><p>Ownership, value and selective disclosure are proven without publishing wallet identity.</p></div><b>unlinkable chain state</b></article><article><span>01</span><div><small>NETWORK</small><h3>Ingress, mix and execution relays</h3><p>Layered packets, fixed-size buckets, batch windows and independently sampled routes.</p></div><b>origin separated from tool</b></article></div></section>

      <section class="band" id="privacy"><h2 class="sec-h">Monero privacy, adapted to agent execution</h2><div class="omni-grid"><article><h3>One-time destinations</h3><p>Every provider settlement derives a fresh output. Reuse is rejected at the client boundary.</p></article><article><h3>Full-set membership</h3><p>A spender proves membership in the eligible set without disclosing which output authorizes the call.</p></article><article><h3>Confidential values</h3><p>Commitments hide fee and settlement amount while range and balance proofs enforce supply.</p></article><article><h3>Selective view keys</h3><p>Agents can grant narrowly scoped audit access without exposing spend authority.</p></article></div><p class="table-note">Ominao borrows privacy constraints and cryptographic patterns from Monero research. It does not inherit Monero mining, consensus or its codebase.</p></section>

      <section class="band"><h2 class="sec-h">Cryptographic components</h2><p class="sec-lede">The protocol separates ownership, value, routing and execution claims so each primitive has one job and one failure boundary.</p><table class="component-table"><thead><tr><th>Component</th><th>Protects</th><th>Verified by</th><th>Public artifact</th></tr></thead><tbody><tr><td>One-time address derivation</td><td>provider destination</td><td>client wallet</td><td>fresh output key</td></tr><tr><td>Full-set membership proof</td><td>authorizing output</td><td>validators</td><td>proof + root</td></tr><tr><td>Pedersen commitment</td><td>fee and settlement value</td><td>validators</td><td>balance commitment</td></tr><tr><td>Nullifier / key image</td><td>double use</td><td>consensus</td><td>spent marker</td></tr><tr><td>Onion packet</td><td>network route</td><td>each relay hop</td><td>none</td></tr><tr><td>Threshold signature</td><td>execution result</td><td>runtime program</td><td>receipt commitment</td></tr><tr><td>Scoped view key</td><td>selective disclosure</td><td>auditor client</td><td>no chain mutation</td></tr></tbody></table></section>

      <section class="band" id="record"><h2 class="sec-h">Public record anatomy</h2><p class="sec-lede">A finalized call is intentionally small. The record proves authorization, balance and execution while omitting the account, tool, prompt, result and provider address.</p><div class="record-figure"><div class="record-ruler"><span>0</span><span>32</span><span>64</span><span>96</span><span>128</span><span>160</span><span>192</span></div><div class="record-bytes"><div class="field version" style="--units:1"><b>VER</b><small>revision</small></div><div class="field epoch" style="--units:2"><b>EPOCH</b><small>relay set</small></div><div class="field root" style="--units:4"><b>ROOT</b><small>eligible outputs</small></div><div class="field nullifier" style="--units:4"><b>NULLIFIER</b><small>anti-replay</small></div><div class="field fee" style="--units:4"><b>FEE COMMITMENT</b><small>hidden value</small></div><div class="field receipt" style="--units:5"><b>RECEIPT COMMITMENT</b><small>input · output · policy · status</small></div></div><div class="record-notes"><span><i></i> consensus-visible</span><span><i></i> fixed length</span><span><i></i> no routing address</span><span><i></i> no MCP payload</span></div></div>
      <table class="component-table record-table"><thead><tr><th>Field</th><th>Consensus rule</th><th>Privacy purpose</th></tr></thead><tbody><tr><td>Protocol revision</td><td>must be active for the target slot</td><td>prevents ambiguous proof rules</td></tr><tr><td>Epoch identifier</td><td>must resolve to a finalized relay set</td><td>binds signatures without naming a route</td></tr><tr><td>Membership root</td><td>must match an accepted output root</td><td>defines the anonymity set</td></tr><tr><td>Nullifier</td><td>must not exist in spent state</td><td>stops replay without revealing ownership</td></tr><tr><td>Fee commitment</td><td>range and conservation proofs must verify</td><td>hides value and provider revenue</td></tr><tr><td>Receipt commitment</td><td>requires the epoch threshold signature</td><td>attests execution without exposing output</td></tr></tbody></table></section>

      <section class="band"><h2 class="sec-h">Key hierarchy</h2><p class="sec-lede">Long-lived identity keys never touch call transport. Every lower branch can rotate or be disclosed without granting authority above it.</p><div class="key-tree"><div class="key-root"><small>OFFLINE ROOT</small><b>Agent master key</b><span>derivation authority only</span></div><div class="key-branch"><article><small>SPEND BRANCH</small><b>Funding key</b><span>authorizes private value</span><em>hardware-isolated</em></article><article><small>CALL BRANCH</small><b>Capability key</b><span>one server scope</span><em>90-second life</em></article><article><small>RETURN BRANCH</small><b>Result key</b><span>decrypts one output</span><em>discard after fetch</em></article><article><small>VIEW BRANCH</small><b>Audit key</b><span>selected records only</span><em>cannot spend</em></article></div></div></section>

      <section class="band"><h2 class="sec-h">Metadata exposure matrix</h2><p class="sec-lede">“Private” is defined per observer. This matrix states which information a conformant implementation may expose during normal operation.</p><div class="matrix-wrap"><table class="privacy-matrix"><thead><tr><th>Observer</th><th>Network origin</th><th>Tool name</th><th>Arguments</th><th>Value</th><th>Result</th><th>Linkable history</th></tr></thead><tbody><tr><td>Entry relay</td><td class="partial">transient</td><td class="sealed">sealed</td><td class="sealed">sealed</td><td class="sealed">sealed</td><td class="sealed">sealed</td><td class="sealed">none</td></tr><tr><td>Mix relay</td><td class="sealed">sealed</td><td class="sealed">sealed</td><td class="sealed">sealed</td><td class="sealed">sealed</td><td class="sealed">sealed</td><td class="sealed">none</td></tr><tr><td>Gateway</td><td class="sealed">sealed</td><td class="visible">visible</td><td class="visible">visible</td><td class="sealed">sealed</td><td class="visible">visible</td><td class="partial">one call</td></tr><tr><td>MCP provider</td><td class="sealed">sealed</td><td class="visible">visible</td><td class="visible">visible</td><td class="partial">quoted fee</td><td class="visible">visible</td><td class="partial">policy-bound</td></tr><tr><td>Validator</td><td class="sealed">sealed</td><td class="sealed">sealed</td><td class="sealed">sealed</td><td class="sealed">commitment</td><td class="sealed">commitment</td><td class="sealed">none</td></tr><tr><td>View-key auditor</td><td class="sealed">sealed</td><td class="partial">if scoped</td><td class="partial">if scoped</td><td class="partial">if scoped</td><td class="partial">if scoped</td><td class="partial">authorized set</td></tr></tbody></table></div><div class="matrix-key"><span><i class="visible"></i>required for execution</span><span><i class="partial"></i>bounded disclosure</span><span><i class="sealed"></i>cryptographically hidden</span></div></section>

      <section class="band"><h2 class="sec-h">Provider registration and execution market</h2><div class="market-flow"><article><span>01</span><h3>Commit policy</h3><p>The provider publishes its MCP server key, tool manifest root, fee curve and runtime policy hash.</p></article><article><span>02</span><h3>Quote privately</h3><p>The client requests a quote through the relay set and receives a signed, short-lived fee commitment.</p></article><article><span>03</span><h3>Match constraints</h3><p>The client selects latency, trust and price bounds without revealing its identity or funding output.</p></article><article><span>04</span><h3>Execute once</h3><p>The quote, capability and policy hash bind one call. Substitution invalidates the receipt.</p></article><article><span>05</span><h3>Settle confidentially</h3><p>Payment reaches a one-time provider destination after the required terminal state is attested.</p></article></div></section>

      <section class="band"><h2 class="sec-h">Why MCP needs a private execution layer</h2><div class="essay"><p>MCP standardizes how agents discover and call tools. It does not hide who made a request, which tool was selected, how often it was called or who received payment. Those fields become an activity graph even when the prompt itself is encrypted.</p><p>Ominao places authorization, transport and settlement behind the same privacy boundary. The provider learns the arguments needed to execute; relays learn only routing state; validators verify commitments and receipts. No participant receives the whole graph by default.</p></div></section>

      <section class="band"><h2 class="sec-h">Execution policy</h2><div class="policy-layout"><div><h3>Provider policy hash</h3><p>Every receipt binds the provider's declared runtime policy: tool version, resource limits, network access and output handling. A policy change produces a different hash and cannot be hidden behind an old endpoint.</p></div><div><h3>Deterministic envelope</h3><p>The protocol commits to the request and response bytes, status and metering. It does not claim every external tool is deterministic; it makes the observed execution independently attributable to one policy.</p></div><div><h3>Failure semantics</h3><p>Timeout, provider rejection and invalid output are terminal receipt states. A failed call cannot silently retry under the same capability or expose a new timing trace.</p></div></div></section>

      <section class="band" id="parameters"><h2 class="sec-h">Reference parameters</h2><table class="params"><tbody><tr><th>Relay depth</th><td>3 hops</td><td>client-selectable, 1–6</td></tr><tr><th>Cohort</th><td>8 relays</td><td>independent operators</td></tr><tr><th>Receipt threshold</th><td>5 of 8</td><td>epoch-scoped keys</td></tr><tr><th>Minimum batch</th><td>24 calls</td><td>otherwise delayed</td></tr><tr><th>Batch window</th><td>4.8 seconds</td><td>padded traffic</td></tr><tr><th>Capability lifetime</th><td>90 seconds</td><td>single use</td></tr><tr><th>Payload buckets</th><td>8 / 32 / 128 KiB</td><td>length-hiding</td></tr><tr><th>Protocol revision</th><td>OIP-001</td><td>reference configuration</td></tr></tbody></table></section>

      <section class="band" id="risks"><h2 class="sec-h">Known limits</h2><div class="risks"><div><h3>Timing correlation</h3><p>Low traffic makes ingress and execution easier to correlate.</p></div><div><h3>Relay quorum</h3><p>A malicious threshold can censor calls or sign false availability claims.</p></div><div><h3>Tool fingerprints</h3><p>Distinct payload sizes and latency can reveal a provider despite encryption.</p></div><div><h3>Provider plaintext</h3><p>The selected provider still receives the arguments required to perform its task.</p></div><div><h3>Proof cost</h3><p>Large anonymity sets increase prover time and state pressure.</p></div><div><h3>Client hygiene</h3><p>Address reuse, logs and direct RPC calls can undo protocol privacy.</p></div></div></section>
      ${postEnd}</article>`;
  }

  function nodes() {
    return `<article class="thread">
      ${postHeader('The relay set, and what each node is allowed to know.', 'Network', 'OIP-002', 'Reference topology')}
      <p class="dek">Ominao separates ingress, mixing, execution and witnessing so no honest node holds a complete route. Operators enroll epoch keys, enter independently sampled cohorts and discard call-level state after finality.</p>
      <div id="topology">${networkFigure()}</div>
      <section class="band" id="roles"><h2 class="sec-h">Four roles, no complete route</h2><div class="omni-grid"><article><h3>Entry relay</h3><p>Accepts a capability and sees the agent's network connection. It cannot decrypt the tool or final destination.</p></article><article><h3>Mix relay</h3><p>Shuffles fixed-size ciphertexts inside a batch. It sees adjacent hops and an epoch identifier.</p></article><article><h3>Execution gateway</h3><p>Opens the final transport layer and calls the MCP provider. It does not receive the caller identity.</p></article><article><h3>Witness</h3><p>Checks committed input/output state and contributes one share to the execution receipt.</p></article></div></section>
      <section class="band" id="boundaries"><h2 class="sec-h">Knowledge boundaries</h2><table class="node-table"><thead><tr><th>Role</th><th>May see</th><th>Must never see</th><th>Requirement</th></tr></thead><tbody><tr><td>Entry relay</td><td>origin, next hop</td><td>tool, arguments, provider</td><td>no call logs</td></tr><tr><td>Mix relay</td><td>batch, adjacent hops</td><td>origin and destination together</td><td>verifiable shuffle</td></tr><tr><td>Gateway</td><td>tool, encrypted session</td><td>agent identity, funding source</td><td>isolated execution</td></tr><tr><td>Witness</td><td>commitments, status</td><td>plaintext input/output</td><td>epoch threshold key</td></tr><tr><td>Validator</td><td>nullifier, proofs, receipt</td><td>caller-provider link</td><td>deterministic verification</td></tr></tbody></table></section>
      <section class="band" id="rotation"><h2 class="sec-h">Admission and rotation</h2><div class="essay"><p>Operators register an identity key, an epoch signing key and a bonded service commitment. Cohorts are sampled from distinct operator domains; repeated placement in adjacent route positions is rejected.</p><p>Keys rotate every epoch. Leaving operators destroy old shares instead of transferring them. Signed equivocation, invalid shuffle proofs and receipt fraud are objective evidence for removal and bond penalties.</p><p>Availability scores affect selection only after a delay, preventing a new operator from buying an immediate route position with short-lived capacity.</p></div></section>
      <section class="band"><h2 class="sec-h">Epoch state machine</h2><div class="epoch-track"><div><span>01</span><b>Enroll</b><p>Operator identity, bond and transport keys enter the pending set.</p></div><div><span>02</span><b>Sample</b><p>Consensus derives cohorts with operator and network-domain separation.</p></div><div><span>03</span><b>Activate</b><p>Distributed key generation produces witness shares for one epoch.</p></div><div><span>04</span><b>Serve</b><p>Relays publish availability proofs without exposing call histories.</p></div><div><span>05</span><b>Retire</b><p>Shares expire, route state is erased and evidence remains challengeable.</p></div></div></section>
      <section class="band" id="faults"><h2 class="sec-h">Fault response</h2><table class="component-table"><thead><tr><th>Observed fault</th><th>Local response</th><th>Network consequence</th></tr></thead><tbody><tr><td>Relay timeout</td><td>rebuild route with a fresh capability envelope</td><td>availability score decreases after delay</td></tr><tr><td>Invalid shuffle proof</td><td>abort the affected batch</td><td>objective removal evidence</td></tr><tr><td>Gateway equivocation</td><td>retain conflicting commitments</td><td>slashable receipt fraud</td></tr><tr><td>Witness unavailable</td><td>wait for threshold or expire</td><td>no partial receipt becomes final</td></tr><tr><td>RPC divergence</td><td>cross-check finalized roots</td><td>reads stop before privacy degrades</td></tr></tbody></table></section>
      <section class="band"><h2 class="sec-h">Retention policy</h2><p class="sec-lede">A node should be able to operate and defend itself without keeping a user history.</p><table class="retention-table"><thead><tr><th>State</th><th>Entry</th><th>Mix</th><th>Gateway</th><th>Witness</th><th>Maximum life</th></tr></thead><tbody><tr><td>Encrypted packet</td><td>yes</td><td>yes</td><td>until opened</td><td>no</td><td>capability expiry</td></tr><tr><td>Network source</td><td>memory only</td><td>no</td><td>no</td><td>no</td><td>active connection</td></tr><tr><td>MCP plaintext</td><td>no</td><td>no</td><td>isolated memory</td><td>no</td><td>receipt creation</td></tr><tr><td>Shuffle evidence</td><td>no</td><td>yes</td><td>no</td><td>commitment</td><td>challenge window</td></tr><tr><td>Receipt share</td><td>no</td><td>no</td><td>request only</td><td>yes</td><td>epoch archive</td></tr></tbody></table></section>
      <section class="band" id="rpc"><h2 class="sec-h">Private RPC</h2><p class="sec-lede">Wallet and agent clients read through oblivious lookup paths. A view key limits results before they leave the node.</p><pre class="code"><code><span class="kw">scan_commitments</span>(view_tag, cursor)  <span class="cm">→ encrypted page</span>
<span class="kw">nullifier_status</span>(digest)          <span class="cm">→ spent | unspent</span>
<span class="kw">receipt_status</span>(commitment)       <span class="cm">→ pending | final</span>
<span class="kw">epoch_relays</span>(epoch)               <span class="cm">→ signed operator set</span></code></pre><p>Nodes must not record wallet addresses, raw view keys, stable client identifiers or request-to-IP mappings.</p></section>
      <section class="band"><h2 class="sec-h">Build and verification requirements</h2><ul><li>Pin the Agave base commit and every cryptographic dependency.</li><li>Publish deterministic build instructions and signed artifact hashes.</li><li>Separate relay, gateway and validator keys at the process and hardware boundary.</li><li>Expose proof, receipt and epoch state through reproducible verification tools.</li><li>Stop admission when relay diversity or receipt quorum falls below policy.</li></ul></section>
      <section class="band" id="operations"><h2 class="sec-h">Operator surfaces</h2><div class="surface-grid"><article><small>PROCESS 01</small><h3>Relay daemon</h3><code>ominao-relay</code><p>Owns transport keys and batch buffers. It has no wallet spend key and no provider credentials.</p></article><article><small>PROCESS 02</small><h3>Witness signer</h3><code>ominao-witness</code><p>Reads commitments from an isolated verifier and releases only a threshold signature share.</p></article><article><small>PROCESS 03</small><h3>Private RPC</h3><code>ominao-rpc</code><p>Serves view-key-scoped queries through an oblivious read path with bounded retention.</p></article></div></section>
      <section class="band"><h2 class="sec-h">Monitoring without surveillance</h2><div class="metric-grid"><article><b>Batch fill</b><strong>aggregate count</strong><p>Publish cohort size and delay distribution, never member identifiers.</p></article><article><b>Relay health</b><strong>signed availability</strong><p>Measure epoch uptime from challenges that cannot be joined to user calls.</p></article><article><b>Proof load</b><strong>bucketed latency</strong><p>Export proof verification percentiles without transaction or IP labels.</p></article><article><b>Receipt health</b><strong>quorum ratio</strong><p>Count final, expired and rejected states at epoch granularity.</p></article></div></section>
      ${postEnd}</article>`;
  }

  function docs() {
    return `<article class="thread docs">
      ${postHeader('Integration', 'MCP', 'OIP-003', 'Client and provider interface')}
      <p class="dek">Ominao carries standard MCP tool calls through a private authorization, transport and settlement envelope. Existing MCP servers keep their tool surface; an adapter handles capabilities, encrypted routing and receipts.</p>
      <div class="doc-status"><span><i></i>REFERENCE INTERFACE</span><span>OIP-003</span><span>JSON-RPC 2.0</span><span>MCP-compatible transport</span></div>
      <div id="integration-flow">${lifecycleFigure()}</div>
      <nav class="docs-toc" aria-label="Sections"><a href="#capabilities">Capabilities</a><a href="#rpc">Private RPC</a><a href="#transport">MCP transport</a><a href="#receipts">Receipts</a><a href="#settlement">Settlement</a><a href="#errors">Errors</a><a href="#hygiene">Client hygiene</a></nav>
      <section id="capabilities"><h2>Capabilities</h2><p>A capability authorizes one call to one server scope. It contains no account name or long-lived API key. The nullifier makes it single-use; the expiry keeps abandoned requests out of later batches.</p><pre class="code"><code>{
  <span class="st">"server_commitment"</span>: <span class="st">"0x…"</span>,
  <span class="st">"tool_scope"</span>:       <span class="st">"research/*"</span>,
  <span class="st">"fee_ceiling"</span>:      <span class="st">"240000"</span>,
  <span class="st">"expires_at"</span>:       <span class="num">1792756800</span>,
  <span class="st">"nullifier"</span>:        <span class="st">"0x…"</span>,
  <span class="st">"return_key"</span>:       <span class="st">"0x…"</span>
}</code></pre><p>The client proves the capability belongs to the eligible set and that its fee commitment is in range. The proof does not reveal the authorizing output.</p></section>
      <section><h2>Capability schema</h2><table class="schema-table"><thead><tr><th>Field</th><th>Type</th><th>Binding</th><th>Validation</th></tr></thead><tbody><tr><td><code>server_commitment</code></td><td>bytes32</td><td>provider identity + policy</td><td>active provider registry root</td></tr><tr><td><code>tool_scope</code></td><td>bytes32</td><td>tool or namespace</td><td>subset of manifest root</td></tr><tr><td><code>fee_ceiling</code></td><td>commitment</td><td>maximum debit</td><td>range proof</td></tr><tr><td><code>expires_at</code></td><td>u64</td><td>last admissible slot</td><td>future, within lifetime cap</td></tr><tr><td><code>nullifier</code></td><td>field</td><td>authorizing output</td><td>unique in finalized state</td></tr><tr><td><code>return_key</code></td><td>public key</td><td>one encrypted result</td><td>valid curve point</td></tr><tr><td><code>route_policy</code></td><td>bytes32</td><td>depth, region, trust bounds</td><td>supported by epoch set</td></tr></tbody></table></section>
      <section><h2>Client state machine</h2><div class="client-machine"><div data-state="01"><b>PREPARE</b><span>resolve provider and epoch</span></div><i></i><div data-state="02"><b>PROVE</b><span>build capability proof</span></div><i></i><div data-state="03"><b>SEAL</b><span>pad and onion-encrypt</span></div><i></i><div data-state="04"><b>SUBMIT</b><span>send to entry relay</span></div><i></i><div data-state="05"><b>VERIFY</b><span>check receipt and result</span></div><i></i><div data-state="06"><b>ERASE</b><span>discard ephemeral keys</span></div></div><p class="table-note">A retry returns to PREPARE with a fresh capability. It never loops from SUBMIT with the same envelope.</p></section>
      <section id="rpc"><h2>Private RPC</h2><p>Submit the outer envelope to a relay endpoint. Keep MCP payload bytes encrypted until the execution gateway has been selected.</p><pre class="code"><code><span class="kw">POST</span> /v1/calls
{
  <span class="st">"epoch"</span>:      <span class="num">8421</span>,
  <span class="st">"capability"</span>: <span class="st">"&lt;commitment + proof&gt;"</span>,
  <span class="st">"route"</span>:      <span class="st">"&lt;onion header&gt;"</span>,
  <span class="st">"payload"</span>:    <span class="st">"&lt;padded ciphertext&gt;"</span>
}</code></pre><p>The response returns a local route handle. It is not an account identifier and expires with the capability.</p></section>
      <section><h2>Endpoint matrix</h2><table class="endpoint-table"><thead><tr><th>Endpoint</th><th>Caller</th><th>Authentication</th><th>Retention</th></tr></thead><tbody><tr><td><code>POST /v1/calls</code></td><td>agent client</td><td>capability proof</td><td>until expiry</td></tr><tr><td><code>GET /v1/routes/:handle</code></td><td>agent client</td><td>return-key challenge</td><td>one fetch window</td></tr><tr><td><code>POST /v1/receipts</code></td><td>witness</td><td>epoch share</td><td>commitment only</td></tr><tr><td><code>GET /v1/epochs/:id</code></td><td>public</td><td>none</td><td>permanent</td></tr><tr><td><code>POST /v1/view</code></td><td>wallet / auditor</td><td>scoped view proof</td><td>no query logs</td></tr></tbody></table></section>
      <section id="transport"><h2>MCP transport</h2><p>The gateway opens the final layer and forwards a normal <code>tools/call</code> request. The provider can validate scope and quote a result without learning the funding output or network origin.</p><pre class="code"><code>{
  <span class="st">"jsonrpc"</span>: <span class="st">"2.0"</span>,
  <span class="st">"method"</span>:  <span class="st">"tools/call"</span>,
  <span class="st">"params"</span>:  {
    <span class="st">"name"</span>:      <span class="st">"private_search"</span>,
    <span class="st">"arguments"</span>: { <span class="st">"query"</span>: <span class="st">"…"</span> }
  }
}</code></pre><p>Providers should bucket response sizes, avoid stable session cookies and return encrypted results to the one-time <code>return_key</code>.</p></section>
      <section><h2>Provider adapter</h2><div class="adapter-grid"><article><span>INBOUND</span><h3>Validate envelope</h3><p>Verify quote, tool scope, policy hash and expiry before opening application arguments.</p></article><article><span>EXECUTION</span><h3>Isolate the call</h3><p>Run with explicit CPU, memory, wall-time and network policy. No stable browser or session state.</p></article><article><span>OUTBOUND</span><h3>Commit the result</h3><p>Hash the canonical response, encrypt it to the return key and request witness attestation.</p></article><article><span>SETTLEMENT</span><h3>Derive one output</h3><p>Use a fresh provider destination bound to this receipt and discard it after finality.</p></article></div></section>
      <section id="receipts"><h2>Execution receipts</h2><p>A receipt binds the capability, request commitment, output commitment, provider policy hash and terminal status. Five of eight epoch witnesses must sign the same tuple.</p><pre class="code"><code>receipt = H(
  capability || request_commitment ||
  output_commitment || policy_hash || status
)</code></pre><p>The chain verifies the aggregate signature and records only the receipt commitment and status. Application output stays encrypted off-chain.</p></section>
      <section><h2>Receipt verification</h2><pre class="code code-tall"><code><span class="kw">function</span> accept(result, receipt, epoch) {
  assert(epoch.finalized)
  assert(receipt.capability === local.capability_commitment)
  assert(receipt.request === H(local.canonical_request))
  assert(receipt.output === H(result.ciphertext))
  assert(receipt.policy === local.accepted_policy_hash)
  assert(verify_threshold(epoch.witness_key, receipt.signature))
  assert(nullifier_status(local.nullifier) === <span class="st">"spent"</span>)
  assert(receipt.status === <span class="st">"final"</span>)
  <span class="kw">return</span> decrypt(local.return_secret, result.ciphertext)
}</code></pre><div class="aside"><h3>Ordering matters</h3><p>Decrypting or acting on output before receipt finality lets a malicious gateway turn speculative results into a correlation channel.</p></div></section>
      <section id="settlement"><h2>Settlement</h2><p>The fee enters as a confidential commitment and exits to a one-time provider destination. Balance proofs show that input equals provider payment plus network fee without publishing either amount.</p><ul><li>Never reuse a provider destination.</li><li>Do not settle several private receipts into one public address.</li><li>Use a separate view key for accounting and a separate spend key for withdrawal.</li></ul></section>
      <section id="errors"><h2>Error model</h2><p>Errors are terminal within a capability. Clients may construct a new call after backoff, but must never resend the same nullifier or ciphertext.</p><table class="endpoint-table"><thead><tr><th>Code</th><th>Meaning</th><th>Client action</th></tr></thead><tbody><tr><td><code>CAPABILITY_EXPIRED</code></td><td>batch admission missed expiry</td><td>derive a fresh capability</td></tr><tr><td><code>ANONYMITY_FLOOR</code></td><td>batch has fewer than 24 calls</td><td>wait; do not bypass relays</td></tr><tr><td><code>ROUTE_INCOMPLETE</code></td><td>one relay failed before gateway</td><td>rebuild every onion layer</td></tr><tr><td><code>POLICY_MISMATCH</code></td><td>provider policy hash changed</td><td>review and re-authorize</td></tr><tr><td><code>RECEIPT_TIMEOUT</code></td><td>witness threshold not reached</td><td>treat output as unfinalized</td></tr></tbody></table></section>
      <section id="hygiene"><h2>Client hygiene</h2><ol><li>Send through the relay ingress, not directly to the provider or validator RPC.</li><li>Use fresh return keys and one-time settlement destinations for every call.</li><li>Keep agent identity, funding keys and audit view keys in separate stores.</li><li>Disable plaintext prompt, tool argument and route logging in production.</li><li>Delay or pad uniquely timed calls when the active batch is small.</li><li>Verify epoch membership and the final receipt before accepting a result.</li></ol></section>
      <section><h2>Canonicalization rules</h2><p>All commitments are computed over deterministic encodings. Equivalent JSON with different key order, whitespace or number syntax must produce the same canonical request.</p><ul><li>UTF-8 only; reject invalid byte sequences before hashing.</li><li>Object keys sorted by raw code point and emitted once.</li><li>Integers use minimal decimal form; floating-point values are not accepted in committed fields.</li><li>Binary values use unpadded base64url or fixed-width hexadecimal as specified by the field.</li><li>Unknown top-level fields are rejected, not ignored.</li><li>Domain separators include protocol revision and record type.</li></ul></section>
      <section><h2>Production integration checklist</h2><div class="check-grid"><label><input type="checkbox" disabled checked> Epoch set verified from finalized state</label><label><input type="checkbox" disabled checked> Payload padded before ingress</label><label><input type="checkbox" disabled checked> Capability and return key are one-time</label><label><input type="checkbox" disabled checked> Provider policy hash pinned</label><label><input type="checkbox" disabled checked> Plaintext application logging disabled</label><label><input type="checkbox" disabled checked> Receipt quorum checked before use</label><label><input type="checkbox" disabled checked> Settlement destination never reused</label><label><input type="checkbox" disabled checked> View and spend keys stored separately</label></div></section>
      ${postEnd}</article>`;
  }

  function bindControls() {
    const slider = document.querySelector('#route-depth');
    const output = document.querySelector('#route-output');
    if (slider && output && !slider.dataset.bound) {
      slider.dataset.bound = 'true';
      slider.addEventListener('input', () => {
        output.value = `${slider.value} ${slider.value === '1' ? 'hop' : 'hops'}`;
        output.textContent = output.value;
      });
    }
    const ca = document.querySelector('.header-ca');
    if (ca && !ca.dataset.bound) {
      ca.dataset.bound = 'true';
      ca.addEventListener('click', async () => {
        const value = ca.dataset.ca;
        if (!value || value === 'TBA') return;
        await navigator.clipboard.writeText(value);
        const status = ca.querySelector('.ca-value small');
        const previous = status.textContent;
        status.textContent = 'COPIED';
        setTimeout(() => { status.textContent = previous; }, 1200);
      });
    }
  }

  function bindPageIndex() {
    const links = [...document.querySelectorAll('.page-index a')];
    if (!links.length || document.querySelector('.page-index')?.dataset.bound) return;
    document.querySelector('.page-index').dataset.bound = 'true';
    const targets = links.map(link => document.querySelector(link.getAttribute('href'))).filter(Boolean);
    const activate = id => {
      links.forEach(link => link.classList.toggle('is-active', link.getAttribute('href') === `#${id}`));
    };
    if (targets[0]) activate(targets[0].id);
    const observer = new IntersectionObserver(entries => {
      const visible = entries.filter(entry => entry.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
      if (visible[0]) activate(visible[0].target.id);
    }, { rootMargin: '-18% 0px -68% 0px', threshold: [0, .1] });
    targets.forEach(target => observer.observe(target));
  }

  function renderPage() {
    const main = document.querySelector('main#main');
    if (!main) return;
    const current = page();
    if (main.dataset.ominaoPage === current) return;
    main.dataset.ominaoPage = current;
    main.innerHTML = current === '/nodes' ? nodes() : current === '/docs' ? docs() : home();
    const legacyRoute = main.querySelector('.ominao-route');
    if (legacyRoute) legacyRoute.outerHTML = premiumRouteConsole();
    main.insertAdjacentHTML('beforeend', pageIndex(current));
    bindControls();
    bindPageIndex();
  }

  function apply() {
    setHead();
    renderShell();
    renderPage();
    document.querySelectorAll('img[src="/logo.png"], img[src="logo.png"]').forEach(img => { img.src = LOGO; });
  }

  function start() {
    apply();
    let queued = false;
    new MutationObserver(() => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(() => { queued = false; apply(); });
    }).observe(document.documentElement, { subtree: true, childList: true });
    addEventListener('popstate', apply);
  }

  if (document.readyState === 'complete') setTimeout(start, 120);
  else addEventListener('load', () => setTimeout(start, 120), { once: true });
})();
