/* ===========================================
   CONECTA SERVIÇOS - funcionamento do site
   Busca, categorias, login, anúncios, favoritos,
   orçamento pelo WhatsApp e janelas.
   =========================================== */

/* >>> TROQUE pelo número de WhatsApp do site: 55 + DDD + número <<< */
var WHATS = "5534999999999";

/* Links das redes sociais do rodapé: WhatsApp, Instagram, Facebook, YouTube */
var SOC = ["https://wa.me/" + WHATS, "https://www.instagram.com/", "https://www.facebook.com/", "https://www.youtube.com/"];

/* >>> BANCO DE DADOS ONLINE (Supabase): cole aqui a URL e a chave "anon public" do seu projeto. <<< */

/* Enquanto estiverem vazias, o site funciona em modo de teste (dados salvos só neste navegador). */
var SUPABASE_URL = "";
var SUPABASE_KEY = "";
var ICONS = { jardim: "img/cat0.png", ar: "img/cat1.png", reparo: "img/cat2.png", pintura: "img/cat3.png", eletrica: "img/cat4.png", encanamento: "img/cat5.png", instalacao: "img/cat6.png" };
var DEFAULT_CATS = [
  { slug: "jardim", nome: "Jardinagem e Limpeza", emoji: "🌿" },
  { slug: "ar", nome: "Ar Condicionado", emoji: "❄️" },
  { slug: "reparo", nome: "Pequenos Reparos", emoji: "🔧" },
  { slug: "pintura", nome: "Pintura", emoji: "🖌️" },
  { slug: "eletrica", nome: "Elétrica", emoji: "⚡" },
  { slug: "encanamento", nome: "Encanamento", emoji: "🚰" },
  { slug: "instalacao", nome: "Instalações e Manutenções", emoji: "🏠" }
];

/* ---------- ÍCONES (SVG) ---------- */
var PIN = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a7 7 0 0 0-7 7c0 5 7 13 7 13s7-8 7-13a7 7 0 0 0-7-7zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5z"/></svg>';
var WA = '<svg viewBox="0 0 24 24" fill="#fff"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.700 6.700 0 0 1-3.300-2.900c-.2-.4.2-.4.700-1.300.1-.2 0-.3 0-.5l-.8-1.800c-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.5.100-.7.300-.2.300-.9.900-.9 2.200s.9 2.500 1.100 2.700c.1.200 1.800 2.800 4.400 3.900 1.600.7 2.300.7 3.100.6.500-.1 1.500-.6 1.700-1.200.2-.6.2-1.100.1-1.200-.1-.1-.2-.2-.5-.3z"/></svg>';

/* ---------- UTILIDADES ---------- */
function $(i) {
  return document.getElementById(i)
}

function E(s) {
  return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
    return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]
  })
}

function norm(s) {
  return String(s).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
}

function slugify(s) {
  return norm(s).replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 40)
}

function ls(k, d) {
  try {
    var v = localStorage.getItem(k);
    return v ? JSON.parse(v) : d
  } catch (e) {
    return d
  }
}

function sv(k, v) {
  try {
    localStorage.setItem(k, JSON.stringify(v))
  } catch (e) {
    aviso("Não foi possível salvar neste navegador")
  }
}

function aviso(t) {
  var e = $("toast");
  e.textContent = t;
  e.classList.add("show");
  setTimeout(function () {
    e.classList.remove("show")
  }, 2600)
}

function fmt(n) {
  return n.toFixed(2).replace(".", ",")
}

function wn(z) {
  z = String(z).replace(/\D/g, "");
  return z.length <= 11 ? "55" + z : z
}

function mail(z) {
  return String(z).replace(/\D/g, "") + "@conectaservicos.app"
}

async function hsh(s) {
  try {
    var b = await crypto.subtle.digest("SHA-256", new TextEncoder().encode("cs:" + s));
    return Array.from(new Uint8Array(b)).map(function (x) {
      return x.toString(16).padStart(2, "0")
    }).join("")
  } catch (e) {
    return btoa(unescape(encodeURIComponent("cs:" + s)))
  }
}

function photo(file) {
  return new Promise(function (res, rej) {
    var url = URL.createObjectURL(file),
      im = new Image();
    im.onload = function () {
      var s = Math.min(1, 640 / Math.max(im.width, im.height)),
        c = document.createElement("canvas");
      c.width = Math.max(1, Math.round(im.width * s));
      c.height = Math.max(1, Math.round(im.height * s));
      var x = c.getContext("2d");
      x.fillStyle = "#fff";
      x.fillRect(0, 0, c.width, c.height);
      x.drawImage(im, 0, 0, c.width, c.height);
      URL.revokeObjectURL(url);
      var d = c.toDataURL("image/jpeg", 0.75);
      if (d.length > 380000) d = c.toDataURL("image/jpeg", 0.5);
      res(d)
    };
    im.onerror = function () {
      URL.revokeObjectURL(url);
      rej(new Error("Informe uma foto JPG ou PNG válida."))
    };
    im.src = url
  })
}

var pic = null,
  picBusy = false;
function prev(inp) {
  var f = inp.files[0],
    b = $("pv");
  if (!f || !b) return;
  pic = null;
  picBusy = true;
  b.innerHTML = '<p>Carregando foto...</p>';
  err("");
  photo(f).then(function (d) {
    pic = d;
    picBusy = false;
    b.innerHTML = '<img src="' + d + '" alt="" style="width:100%;border-radius:10px;margin-top:8px"><button type="button" class="lnk" onclick="noPic()">Remover foto</button>'
  }).catch (function (x) {
    picBusy = false;
    b.innerHTML = "";
    err(x.message)
  })
}

function noPic() {
  pic = null;
  picBusy = false;
  $("pv").innerHTML = "";
  var l = document.querySelectorAll("#md input[type=file]");
  for (var i = 0; i < l.length; i++) l[i].value = ""
}

/* ---------- ESTADO ---------- */
var SB = null,
  ONLINE = false;
try {
  if (window.supabase && SUPABASE_URL && SUPABASE_KEY) {
    SB = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
    ONLINE = true
  }
} catch (e) {
  SB = null;
  ONLINE = false
}

var me = null,
  cats = [],
  ads = [],
  favs = ls("cs_favs", []),
  loc = ls("cs_loc", "Coromandel - MG");
var cur = "",
  q = "",
  favOnly = false,
  pend = null,
  loading = true;
function localCats() {
  return ls("cs_cats", null) || DEFAULT_CATS.map(function (c) {
    return { slug: c.slug, nome: c.nome, emoji: c.emoji, o: null }
  })
}

function rowAd(r) {
  return { id: r.id, t: r.titulo, c: r.categoria, p: r.preco, w: r.whatsapp, d: r.descricao || "", img: r.foto || "", l: r.cidade || "", o: r.user_id }
}

function rowCat(r) {
  return { slug: r.slug, nome: r.nome, emoji: r.emoji || "🛠️", o: r.criado_por || null }
}

function canDel(owner) {
  return !!me &&  (me.admin || me.id === owner)
}

function catOf(slug) {
  for (var i = 0; i < cats.length; i++) if (cats[i].slug === slug) return cats[i];
  return { slug: slug, nome: slug, emoji: "🛠️", o: null }
}

function ci(c) {
  return ICONS[c.slug] ? '<img src="' + ICONS[c.slug] + '" alt="">' : '<span class="em">' + E(c.emoji) + '</span>'
}

/* ---------- DADOS (Supabase ou modo de teste) ---------- */
async function loadAll() {
  try {
    if (ONLINE) {
      var a = await SB.from("anuncios").select("*").order("created_at", { ascending: false });
      var c = await SB.from("categorias").select("*").order("ordem");
      if (a.error) throw a.error;
      if (c.error) throw c.error;
      ads = a.data.map(rowAd);
      cats = c.data.map(rowCat)
    } else {
      ads = ls("cs_ads", []);
      cats = localCats()
    }
  } catch (e) {
    aviso("Não foi possível carregar os dados. Verifique a conexão.")
  }
  loading = false
}

async function loadMe(uid) {
  var r = await SB.from("profiles").select("*").eq("id", uid).single();
  me = r.data ?  { id: uid, nome: r.data.nome, zap: r.data.zap, admin: !!r.data.is_admin } : null
}

async function restore() {
  try {
    if (ONLINE) {
      var s = await SB.auth.getSession();
      if (s.data && s.data.session) await loadMe(s.data.session.user.id)
    } else {
      var z = ls("cs_sess", null),
        u = ls("cs_users", {});
      if (z && u[z]) me = { id: z, nome: u[z].nome, zap: z, admin: !!u[z].admin }
    }
  } catch (e) {
    me = null
  }
}

async function saveAd(a) {
  if (ONLINE) {
    var r = await SB.from("anuncios").insert({ titulo: a.t, categoria: a.c, preco: a.p, whatsapp: a.w, descricao: a.d, foto: a.img, cidade: a.l });
    if (r.error) throw r.error;
    return
  }
  a.id = "a" + Date.now();
  a.o = me.id;
  var l = ls("cs_ads", []);
  l.unshift(a);
  sv("cs_ads", l)
}

async function removeAd(id) {
  if (ONLINE) {
    var r = await SB.from("anuncios").delete().eq("id", id).select();
    if (r.error) throw r.error;
    if (!r.data.length) throw new Error("Sem permissão para excluir.")
  } else {
    sv("cs_ads", ls("cs_ads", []).filter(function (a) {
      return a.id !== id
    }))
  }
}

async function saveCat(nome, emoji) {
  var slug = slugify(nome);
  if (!slug) throw new Error("Informe um nome válido para a categoria.");
  if (cats.some(function (c) {
    return c.slug === slug
  })) return slug;
  var em = emoji || "🛠️";
  if (ONLINE) {
    var r = await SB.from("categorias").insert({ slug: slug, nome: nome, emoji: em, criado_por: me.id });
    if (r.error) throw r.error
  } else {
    var l = localCats();
    l.push({ slug: slug, nome: nome, emoji: em, o: me.id });
    sv("cs_cats", l)
  }
  return slug
}

async function removeCat(slug) {
  if (ONLINE) {
    var r = await SB.from("categorias").delete().eq("slug", slug).select();
    if (r.error) throw r.error;
    if (!r.data.length) throw new Error("Sem permissão para excluir.")
  } else {
    sv("cs_cats", localCats().filter(function (c) {
      return c.slug !== slug
    }));
    sv("cs_ads", ls("cs_ads", []).filter(function (a) {
      return a.c !== slug
    }))
  }
}

function msgErr(x) {
  var m = (x && x.message) || "";
  if (/registered|exists/i.test(m)) return "Este número já tem cadastro. Use a aba Entrar.";
  if (/invalid login/i.test(m)) return "Número ou senha incorretos.";
  if (m === "confirm") return "Conta criada, mas a confirmação de e-mail está ativa no Supabase. Desative em Authentication > Providers > Email.";
  if (/password/i.test(m)) return "A senha precisa ter pelo menos 6 caracteres.";
  if (/network|fetch/i.test(m)) return "Sem conexão. Tente de novo.";
  if (m.indexOf("Sem permissão") === 0 || m.indexOf("Informe") === 0 || m.indexOf("Aguarde") === 0) return m;
  return "Erro: " + m
}

function btnBusy(f, b) {
  var x = f.querySelector(".gbtn");
  if (x) {
    x.disabled = b;
    x.style.opacity = b ? 0.6 : 1
  }
}

/* ---------- JANELAS (MODAIS) ---------- */
var M = {
  como: function () {
    return '<h2>Como funciona</h2><ol><li><b>Busque</b> o serviço que você precisa ou escolha uma categoria.</li><li><b>Compare</b> preços e anúncios dos profissionais.</li><li><b>Solicite um orçamento</b> direto pelo WhatsApp do profissional.</li><li><b>Combine</b> os detalhes e feche o serviço.</li></ol><p>Quer oferecer seus serviços? Crie sua conta e clique em “Anunciar Serviço”. Não achou sua área? Crie uma nova categoria.</p>'
  },
  seg: function () {
    return '<h2>Segurança</h2><ul><li>Converse e combine o serviço antes de fechar, sempre pelo WhatsApp do anúncio.</li><li>Peça referências e veja o trabalho do profissional.</li><li>Evite pagar o valor total antecipado.</li><li>Combine preço, prazo e materiais por escrito.</li><li>Desconfie de preços muito abaixo do normal.</li></ul><p>Nunca compartilhe senhas ou códigos de verificação.</p>'
  },
  ajuda: function () {
    return '<h2>Ajuda</h2><div class="faq"><details><summary>Como peço um orçamento?</summary><p>Clique em “Solicitar Orçamento” no serviço. O WhatsApp do profissional abre com a mensagem pronta.</p></details><details><summary>Como anuncio meu serviço?</summary><p>Crie sua conta, clique em “Anunciar Serviço”, preencha título, categoria, preço e WhatsApp, e publique.</p></details><details><summary>Como crio uma categoria nova?</summary><p>No formulário de anúncio escolha “Nova categoria”, ou clique em “Ver todas” nas categorias.</p></details><details><summary>Como excluo um anúncio?</summary><p>Clique em “Excluir meu anúncio” no seu anúncio. Só você (ou o administrador) pode excluir.</p></details></div><a class="wb" style="margin:14px 0 0;height:46px" target="_blank" rel="noopener" href="https://wa.me/' + WHATS + '?text=' + encodeURIComponent("Olá! Preciso de ajuda no Conecta Serviços.") + '">' + WA + 'Falar com o suporte</a>'
  },
  sobre: function () {
    return '<h2>Sobre nós</h2><p>O Conecta Serviços aproxima quem precisa de um serviço de profissionais da sua região, de forma rápida e segura.</p><p>Serviço certo, na sua mão!</p>'
  },
  termos: function () {
    return '<h2>Termos de uso</h2><p>O Conecta Serviços é uma plataforma que aproxima clientes e profissionais. A negociação, o pagamento e a execução do serviço são combinados diretamente entre as partes.</p><p>Os anúncios são de responsabilidade de quem os publica. Conteúdos falsos, ofensivos ou ilegais podem ser removidos pelo administrador.</p>'
  },
  priv: function () {
    return '<h2>Política de privacidade</h2><p>Coletamos apenas os dados informados no cadastro (nome e WhatsApp) para o funcionamento da conta e dos anúncios.</p><p>Os dados não são vendidos. O WhatsApp informado em um anúncio fica visível para quem pedir orçamento.</p>'
  },
  contato: function () {
    return '<h2>Fale conosco</h2><form onsubmit="return doCt(event)"><label>Seu nome</label><input name="n" required maxlength="60"><label>Mensagem</label><textarea name="m" rows="4" required maxlength="500"></textarea><button class="gbtn">Enviar pelo WhatsApp</button></form>'
  },
  cats: function () {
    var mine = cats.filter(function (c) {
      return canDel(c.o)
    });
    return '<h2>Categorias</h2><div class="catl">' + cats.map(function (c) {
      return '<button onclick="filtrar(\'' + c.slug + '\')">' + ci(c) + E(c.nome) + '</button>'
    }).join("") + '</div><button class="gbtn" onclick="novaCat()">＋ Criar nova categoria</button>' + (mine.length ? '<h3 style="margin:18px 0 8px;font-size:1rem">Categorias que você pode excluir</h3>' + mine.map(function (c) {
      return '<div class="row"><span>' + E(c.nome) + '</span><button onclick="delCat(\'' + c.slug + '\')">Excluir</button></div>'
    }).join("") : "")
  },
  novacat: function () {
    return '<h2>Nova categoria</h2><form onsubmit="return doCat(event)"><label>Nome da categoria</label><input name="n" required maxlength="40" placeholder="Ex.: Mecânico"><label>Emoji (opcional)</label><input name="e" maxlength="4" placeholder="🔧"><div class="err" id="err"></div><button class="gbtn">Criar categoria</button></form>'
  },
  regiao: function () {
    return '<h2>Alterar região</h2><form onsubmit="return setLoc(event)"><label>Cidade - UF</label><input name="l" required maxlength="40" value="' + E(loc) + '" placeholder="Ex.: Coromandel - MG"><button class="gbtn">Salvar região</button></form><p style="margin-top:14px">Sugestões:</p>' + ["Coromandel - MG", "Patos de Minas - MG", "Patrocínio - MG", "Monte Carmelo - MG", "Paracatu - MG"].map(function (c) {
      return '<button class="lnk" style="display:block" onclick="pickLoc(\'' + c + '\')">' + c + '</button>'
    }).join("")
  },
  login: function (t) {
    var up = t === "up";
    return '<h2>' + (up ? 'Criar conta' : 'Entrar') + '</h2><div class="tabs"><button class="' + (up ? '' : 'on') + '" onclick="openM(\'login\',\'in\')">Entrar</button><button class="' + (up ? 'on' : '') + '" onclick="openM(\'login\',\'up\')">Cadastrar</button></div><form onsubmit="return ' + (up ? 'doUp' : 'doIn') + '(event)">' + (up ? '<label>Nome</label><input name="nome" required maxlength="60" autocomplete="name">' : '') + '<label>Número de WhatsApp (com DDD)</label><input name="zap" required inputmode="tel" placeholder="(34) 99999-9999" autocomplete="tel"><label>Senha</label><input name="senha" type="password" required minlength="6" placeholder="Mínimo 6 caracteres" autocomplete="' + (up ? 'new-password' : 'current-password') + '"><div class="err" id="err"></div><button class="gbtn">' + (up ? 'Criar conta' : 'Entrar') + '</button></form>'
  },
  conta: function () {
    var mine = ads.filter(function (a) {
      return a.o === me.id
    });
    return '<h2>Olá, ' + E(me.nome.split(" ")[0]) + (me.admin ? ' <small style="font-size:.7rem;background:#4fd63b;color:#052044;padding:3px 8px;border-radius:20px;vertical-align:middle">Administrador</small>' : '') + '</h2><p>WhatsApp: ' + E(me.zap) + '</p><button class="gbtn" style="margin-top:6px" onclick="anunciar()">＋ Anunciar serviço</button><h3 style="margin:18px 0 8px;font-size:1rem">Meus anúncios (' + mine.length + ')</h3>' + (mine.map(function (a) {
      return '<div class="row"><span>' + E(a.t) + ' · R$ ' + E(a.p) + '</span><button onclick="delAd(\'' + a.id + '\')">Excluir</button></div>'
    }).join("") || '<p>Você ainda não anunciou.</p>') + (me.admin ? '<p>Como administrador, você vê o botão de excluir em todos os anúncios e categorias.</p>' : '') + '<button class="lnk" onclick="showFav()">♥ Ver meus favoritos (' + favs.length + ')</button><br><button class="lnk" onclick="sair()">Sair da conta</button>'
  },
  anuncio: function (c) {
    return '<h2>Anunciar serviço</h2><form onsubmit="return doAd(event)"><label>Título do serviço</label><input name="t" required maxlength="50" placeholder="Ex.: Corte de grama residencial"><label>Categoria</label><select name="c" onchange="$(\'nc\').style.display=this.value===\'__new\'?\'block\':\'none\'">' + cats.map(function (x) {
      return '<option value="' + x.slug + '"' + (x.slug === c ? ' selected' : '') + '>' + E(x.nome) + '</option>'
    }).join("") + '<option value="__new">＋ Nova categoria...</option></select><div id="nc" style="display:none"><label>Nome da nova categoria</label><input name="ncn" maxlength="40" placeholder="Ex.: Mecânico"><label>Emoji (opcional)</label><input name="nce" maxlength="4" placeholder="🔧"></div><label>Preço (R$)</label><input name="p" required inputmode="decimal" placeholder="80,00"><label>WhatsApp para orçamentos</label><input name="w" required inputmode="tel" value="' + E(me.zap) + '"><label>Descrição</label><textarea name="d" rows="3" maxlength="300" placeholder="O que você faz, região atendida..."></textarea><label>Foto (opcional)</label><div class="fb"><label class="fbtn">📷 Tirar foto<input type="file" accept="image/*" capture="environment" onchange="prev(this)"></label><label class="fbtn">🖼️ Galeria<input type="file" accept="image/*" onchange="prev(this)"></label></div><div id="pv"></div><div class="err" id="err"></div><button class="gbtn">Publicar anúncio</button></form>'
  },
  det: function (id) {
    var s = ads.filter(function (x) {
      return x.id === id
    })[0];
    if (!s) return '';
    var m = encodeURIComponent("Olá! Vi seu anúncio no Conecta Serviços: " + s.t);
    return '<h2>' + E(s.t) + '</h2>' + (s.img ? '<img src="' + E(s.img) + '" alt="" style="width:100%;border-radius:12px;margin-bottom:10px">' : '') + '<p><b>' + E(catOf(s.c).nome) + '</b> · ' + E(s.l) + '</p><p style="font-size:1.4rem;font-weight:800;color:#0b1f4a">R$ ' + E(s.p) + '</p><p>' + E(s.d) + '</p><a class="wb" style="margin:14px 0 0;height:46px" target="_blank" rel="noopener" href="https://wa.me/' + E(s.w) + '?text=' + m + '">' + WA + 'Solicitar Orçamento</a>' + (canDel(s.o) ? '<button class="del" style="width:100%;margin:10px 0 0;height:42px" onclick="delAd(\'' + s.id + '\')">🗑 Excluir ' + (me.id === s.o ? 'meu anúncio' : 'anúncio (administrador)') + '</button>' : '')
  },
  conf: function (id) {
    var a = ads.filter(function (x) {
      return x.id === id
    })[0];
    return '<h2>Excluir anúncio?</h2><p>O anúncio “' + E(a ? a.t : "") + '” será removido do site. Essa ação não pode ser desfeita.</p><button class="gbtn" style="background:#e0245e;color:#fff" onclick="delAd(\'' + id + '\',1)">Sim, excluir</button><button class="lnk" style="display:block;margin:10px auto 0" onclick="closeM()">Cancelar</button>'
  },
  confc: function (slug) {
    return '<h2>Excluir categoria?</h2><p>A categoria “' + E(catOf(slug).nome) + '” e todos os anúncios dela serão removidos. Essa ação não pode ser desfeita.</p><button class="gbtn" style="background:#e0245e;color:#fff" onclick="delCat(\'' + slug + '\',1)">Sim, excluir</button><button class="lnk" style="display:block;margin:10px auto 0" onclick="closeM()">Cancelar</button>'
  }
};
function openM(n, a) {
  $("md").innerHTML = '<button class="x" onclick="closeM()" aria-label="Fechar">✕</button>' + M[n](a);
  $("ov").classList.add("show");
  document.body.style.overflow = "hidden";
  $("md").scrollTop = 0;
  var f = $("md").querySelector("input,textarea");
  if (f && window.innerWidth > 700 && f.type !== "file") f.focus()
}

function closeM() {
  $("ov").classList.remove("show");
  document.body.style.overflow = "";
  pend = null
}

document.addEventListener("keydown", function (e) {
  if (e.key === "Escape") closeM()
});
function err(t) {
  var e = $("err");
  if (e) e.textContent = t
}

/* ---------- CONTA, LOGIN E REGIÃO ---------- */
async function doUp(e) {
  e.preventDefault();
  var f = e.target,
    nome = f.nome.value.trim(),
    z = f.zap.value.replace(/\D/g, ""),
    pw = f.senha.value;
  if (z.length < 10) {
    err("Informe o WhatsApp com DDD.");
    return false
  }
  btnBusy(f, true);
  try {
    if (ONLINE) {
      var r = await SB.auth.signUp({ email: mail(z), password: pw });
      if (r.error) throw r.error;
      if (!r.data.session) throw new Error("confirm");
      var p = await SB.from("profiles").insert({ id: r.data.user.id, nome: nome, zap: z });
      if (p.error) throw p.error;
      me = { id: r.data.user.id, nome: nome, zap: z, admin: false }
    } else {
      var u = ls("cs_users", {});
      if (u[z]) throw new Error("exists");
      var first = Object.keys(u).length === 0;
      u[z] = { nome: nome, h: await hsh(pw), admin: first };
      sv("cs_users", u);
      sv("cs_sess", z);
      me = { id: z, nome: nome, zap: z, admin: first }
    }
    startS()
  } catch (x) {
    err(msgErr(x))
  } finally {
    btnBusy(f, false)
  }
  return false
}

async function doIn(e) {
  e.preventDefault();
  var f = e.target,
    z = f.zap.value.replace(/\D/g, ""),
    pw = f.senha.value;
  btnBusy(f, true);
  try {
    if (ONLINE) {
      var r = await SB.auth.signInWithPassword({ email: mail(z), password: pw });
      if (r.error) throw r.error;
      await loadMe(r.data.user.id);
      if (!me) throw new Error("Perfil não encontrado.")
    } else {
      var u = ls("cs_users", {}),
        acc = u[z];
      if (!acc || acc.h !== await hsh(pw)) throw new Error("Invalid login");
      sv("cs_sess", z);
      me = { id: z, nome: acc.nome, zap: z, admin: !!acc.admin }
    }
    startS()
  } catch (x) {
    err(msgErr(x))
  } finally {
    btnBusy(f, false)
  }
  return false
}

function startS() {
  var p = pend;
  pend = null;
  closeM();
  upd();
  rs();
  aviso("Olá, " + me.nome.split(" ")[0] + "!");
  if (p) setTimeout(p, 250)
}

async function sair() {
  try {
    if (ONLINE) await SB.auth.signOut()
  } catch (e) {}me = null;
  sv("cs_sess", null);
  closeM();
  upd();
  rs();
  aviso("Você saiu da conta.")
}

function upd() {
  $("lgtx").innerHTML = me ? 'Olá, ' + E(me.nome.split(" ")[0]) + '<br>Minha conta' : 'Entrar<br>ou Cadastrar';
  var l = document.querySelectorAll(".locname");
  for (var i = 0; i < l.length; i++) l[i].textContent = loc
}

function setLoc(e) {
  e.preventDefault();
  loc = e.target.l.value.trim();
  sv("cs_loc", loc);
  closeM();
  upd();
  aviso("Região: " + loc);
  return false
}

function pickLoc(c) {
  loc = c;
  sv("cs_loc", loc);
  closeM();
  upd();
  aviso("Região: " + loc)
}

function doCt(e) {
  e.preventDefault();
  var f = e.target;
  window.open("https://wa.me/" + WHATS + "?text=" + encodeURIComponent("Olá! Sou " + f.n.value.trim() + ". " + f.m.value.trim()), "_blank");
  closeM();
  return false
}

/* ---------- ANÚNCIOS E CATEGORIAS ---------- */
function anunciar(c) {
  pic = null;
  picBusy = false;
  if (!me) {
    pend = function () {
      anunciar(c)
    };
    openM("login", "up");
    return
  }
  openM("anuncio", typeof c === "string" ? c : cur)
}

function novaCat() {
  if (!me) {
    pend = novaCat;
    openM("login", "up");
    return
  }
  openM("novacat")
}

async function doAd(e) {
  e.preventDefault();
  var f = e.target,
    s = f.p.value.trim(),
    p = s.indexOf(",") > -1 ? parseFloat(s.replace(/\./g, "").replace(",", ".")) : parseFloat(s);
  if (!(p > 0)) {
    err("Informe um preço válido.");
    return false
  }
  var w = f.w.value.replace(/\D/g, "");
  if (w.length < 10) {
    err("WhatsApp inválido (use o DDD).");
    return false
  }
  btnBusy(f, true);
  try {
    var c = f.c.value;
    if (c === "__new") {
      var nn = f.ncn.value.trim();
      if (nn.length < 2) throw new Error("Informe o nome da nova categoria.");
      c = await saveCat(nn, f.nce.value.trim())
    }
    if (picBusy) throw new Error("Aguarde a foto terminar de carregar.");
    var img = pic || "";
    await saveAd({ t: f.t.value.trim(), c: c, p: fmt(p), w: wn(w), d: f.d.value.trim(), img: img, l: loc });
    await loadAll();
    closeM();
    cur = "";
    q = "";
    favOnly = false;
    rc();
    rs();
    go();
    aviso("Anúncio publicado!")
  } catch (x) {
    err(msgErr(x))
  } finally {
    btnBusy(f, false)
  }
  return false
}

async function doCat(e) {
  e.preventDefault();
  var f = e.target;
  btnBusy(f, true);
  try {
    await saveCat(f.n.value.trim(), f.e.value.trim());
    await loadAll();
    closeM();
    rc();
    rs();
    aviso("Categoria criada!")
  } catch (x) {
    err(msgErr(x))
  } finally {
    btnBusy(f, false)
  }
  return false
}

async function delAd(id, ok) {
  var a = ads.filter(function (x) {
    return x.id === id
  })[0];
  if (!a || !canDel(a.o)) return;
  if (!ok) {
    openM("conf", id);
    return
  }
  try {
    await removeAd(id);
    favs = favs.filter(function (x) {
      return x !== id
    });
    sv("cs_favs", favs);
    await loadAll();
    closeM();
    rs();
    aviso("Anúncio excluído.")
  } catch (x) {
    closeM();
    aviso(msgErr(x))
  }
}

async function delCat(slug, ok) {
  var c = catOf(slug);
  if (!canDel(c.o)) return;
  if (!ok) {
    openM("confc", slug);
    return
  }
  try {
    await removeCat(slug);
    if (cur === slug) cur = "";
    await loadAll();
    closeM();
    rc();
    rs();
    aviso("Categoria excluída.")
  } catch (x) {
    closeM();
    aviso(msgErr(x))
  }
}

function showFav() {
  closeM();
  favOnly = true;
  cur = "";
  q = "";
  rc();
  rs();
  go()
}

/* ---------- LISTA DE SERVIÇOS ---------- */
function card(s) {
  var f = favs.indexOf(s.id) > -1,
    del = canDel(s.o),
    cat = catOf(s.c),
    m = encodeURIComponent("Olá! Vi seu anúncio no Conecta Serviços: " + s.t),
    o = 'onclick="openM(\'det\',\'' + s.id + '\')"';
  var ph = s.img ? '<img src="' + E(s.img) + '" alt="' + E(s.t) + '" ' + o + ' style="cursor:pointer">' : '<div class="adph" ' + o + '>' + ci(cat) + '</div>';
  return '<article class="card"><div class="ph">' + ph + '<button class="hb ad' + (f ? ' on' : '') + '" aria-label="Favoritar" onclick="fav(\'' + s.id + '\',this)">' + (f ? '♥' : '♡') + '</button></div><div class="in"><div class="rt"><em>★</em><b>Novo</b> · ' + E(cat.nome) + '</div><h3 style="cursor:pointer" ' + o + '>' + E(s.t) + '</h3><div class="lc">' + PIN + E(s.l) + '</div><div class="pr">R$ ' + E(s.p) + '</div></div><a class="wb" target="_blank" rel="noopener" href="https://wa.me/' + E(s.w) + '?text=' + m + '">' + WA + 'Solicitar Orçamento</a>' + (del ? '<button class="del" onclick="delAd(\'' + s.id + '\')">🗑 Excluir ' + (me.id === s.o ? 'meu anúncio' : '(administrador)') + '</button>' : '') + '</article>'
}

function fav(id, el) {
  var i = favs.indexOf(id);
  if (i > -1) favs.splice(i, 1);
  else favs.push(id);
  sv("cs_favs", favs);
  var on = i < 0;
  el.classList.toggle("on", on);
  el.textContent = on ? "♥" : "♡";
  if (favOnly) rs()
}

function rc() {
  $("cats").innerHTML = cats.map(function (c) {
    return '<button class="cat' + (cur === c.slug ? ' on' : '') + '" onclick="filtrar(\'' + c.slug + '\')">' + ci(c) + E(c.nome).replace(" e ", "<br>e ").replace("Pequenos ", "Pequenos<br>") + '</button>'
  }).join("")
}

function rs() {
  var v = $("vazio");
  if (loading) {
    $("cards").innerHTML = "";
    v.style.display = "block";
    v.innerHTML = "Carregando serviços...";
    return
  }
  var qq = norm(q),
    l = ads.filter(function (s) {
    return (!cur || s.c === cur) &&  (!favOnly || favs.indexOf(s.id) > -1) &&  (!qq || norm(s.t + " " + s.d).indexOf(qq) > -1)
  });
  $("cards").innerHTML = l.map(card).join("");
  if (l.length) v.style.display = "none";
  else {
    v.style.display = "block";
    v.innerHTML = ads.length ? 'Nenhum serviço encontrado.<br><button class="lnk" onclick="anunciar(cur)">Anunciar um serviço aqui</button> · <button class="lnk" onclick="limpar()">Limpar filtro</button>' : 'Ainda não há serviços anunciados.<br><button class="lnk" onclick="anunciar()">Seja o primeiro a anunciar</button>'
  }
  var fl = [];
  if (cur) fl.push(E(catOf(cur).nome));
  if (q) fl.push("“" + E(q) + "”");
  if (favOnly) fl.push("favoritos");
  $("flt").innerHTML = fl.length ? 'Mostrando: <b>' + fl.join(" · ") + '</b> <button class="lnk" onclick="limpar()">Limpar filtro</button>' : ""
}

function go() {
  $("cards").scrollIntoView({ behavior: "smooth", block: "center" })
}

function limpar() {
  cur = "";
  q = "";
  favOnly = false;
  rc();
  rs()
}

function filtrar(c) {
  closeM();
  cur = (c && cur === c) ? "" : c;
  q = "";
  favOnly = false;
  rc();
  rs();
  go()
}

function buscar(v) {
  q = String(v).trim();
  cur = "";
  favOnly = false;
  rc();
  rs();
  go()
}

function burger() {
  if (window.innerWidth <= 700) $("nav").classList.toggle("open");
  else openM("cats")
}

function closeNav() {
  $("nav").classList.remove("open")
}

async function init() {
  if (SUPABASE_URL && !ONLINE) aviso("Banco online indisponível. Verifique a internet e as chaves.");
  await restore();
  await loadAll();
  upd();
  rc();
  rs()
}

/* ---------- INÍCIO ---------- */
for (var i = 0; i < 4; i++) $("s" + i).href = SOC[i];
upd();
rc();
rs();
init();
