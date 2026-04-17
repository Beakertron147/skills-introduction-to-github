'use strict';

// NHL '95 – Full rosters (2024-25 season, including injured reserve)
// ir:true = on injured reserve
// Stats: spd/sht/pas/chk 60-98 | save 80-93 (goalies only)
// Positions: C, LW, RW, D, G

const TEAMS = [

  // ── EASTERN CONFERENCE – ATLANTIC DIVISION ────────────────────────────────

  {
    id: 0, name: 'Boston Bruins', abbr: 'BOS', city: 'Boston',
    conf: 'E', div: 'Atlantic',
    primary: '#FFB81C', secondary: '#000000', textColor: '#000000',
    roster: [
      // Forwards
      { n:'Marchand',   num:63, pos:'LW', spd:90, sht:86, pas:80, chk:92, ir:false },
      { n:'Pastrnak',   num:88, pos:'RW', spd:85, sht:95, pas:82, chk:70, ir:false },
      { n:'Zacha',      num:18, pos:'C',  spd:82, sht:80, pas:84, chk:78, ir:false },
      { n:'Coyle',      num:13, pos:'C',  spd:80, sht:78, pas:78, chk:82, ir:false },
      { n:'Frederic',   num:11, pos:'LW', spd:82, sht:76, pas:72, chk:88, ir:false },
      { n:'Geekie',     num:39, pos:'C',  spd:78, sht:74, pas:76, chk:78, ir:false },
      { n:'Heinen',     num:43, pos:'LW', spd:78, sht:74, pas:76, chk:72, ir:false },
      { n:'Lauko',      num:94, pos:'LW', spd:82, sht:72, pas:70, chk:74, ir:false },
      { n:'Lazar',      num:20, pos:'C',  spd:76, sht:68, pas:70, chk:80, ir:false },
      // Defence
      { n:'McAvoy',     num:73, pos:'D',  spd:86, sht:82, pas:86, chk:88, ir:false },
      { n:'Grzelcyk',   num:48, pos:'D',  spd:80, sht:72, pas:82, chk:76, ir:false },
      { n:'Carlo',      num:25, pos:'D',  spd:78, sht:68, pas:74, chk:86, ir:false },
      { n:'Lindholm',   num:79, pos:'D',  spd:80, sht:74, pas:80, chk:80, ir:false },
      { n:'Forbort',    num:27, pos:'D',  spd:76, sht:66, pas:72, chk:84, ir:false },
      // Goalies
      { n:'Swayman',    num: 1, pos:'G',  spd:62, sht: 0, pas: 0, chk: 0, save:90, ir:false },
      { n:'Bussi',      num:30, pos:'G',  spd:60, sht: 0, pas: 0, chk: 0, save:83, ir:false },
    ],
  },

  {
    id: 1, name: 'Buffalo Sabres', abbr: 'BUF', city: 'Buffalo',
    conf: 'E', div: 'Atlantic',
    primary: '#002654', secondary: '#FCB514', textColor: '#FCB514',
    roster: [
      { n:'T.Thompson', num:72, pos:'C',  spd:86, sht:90, pas:84, chk:82, ir:false },
      { n:'Peterka',    num:77, pos:'RW', spd:88, sht:86, pas:80, chk:70, ir:false },
      { n:'Cozens',     num:24, pos:'C',  spd:86, sht:82, pas:80, chk:78, ir:false },
      { n:'Tuch',       num:89, pos:'LW', spd:88, sht:80, pas:76, chk:85, ir:false },
      { n:'Okposo',     num:21, pos:'RW', spd:72, sht:76, pas:74, chk:78, ir:false },
      { n:'Girgensons', num:28, pos:'C',  spd:78, sht:70, pas:72, chk:82, ir:false },
      { n:'Quinn',      num: 8, pos:'LW', spd:78, sht:74, pas:76, chk:74, ir:false },
      { n:'Bjork',      num:15, pos:'LW', spd:78, sht:72, pas:74, chk:74, ir:false },
      { n:'Krebs',      num:19, pos:'C',  spd:80, sht:72, pas:76, chk:72, ir:false },
      { n:'Dahlin',     num:26, pos:'D',  spd:92, sht:85, pas:90, chk:76, ir:false },
      { n:'Power',      num:25, pos:'D',  spd:82, sht:80, pas:82, chk:80, ir:false },
      { n:'Samuelsson', num:54, pos:'D',  spd:80, sht:72, pas:76, chk:80, ir:false },
      { n:'Pilut',      num:14, pos:'D',  spd:78, sht:70, pas:78, chk:74, ir:false },
      { n:'Bryson',     num: 4, pos:'D',  spd:78, sht:72, pas:74, chk:76, ir:false },
      { n:'Luukkonen',  num: 1, pos:'G',  spd:62, sht: 0, pas: 0, chk: 0, save:87, ir:false },
      { n:'Tokarski',   num:31, pos:'G',  spd:60, sht: 0, pas: 0, chk: 0, save:82, ir:false },
    ],
  },

  {
    id: 2, name: 'Detroit Red Wings', abbr: 'DET', city: 'Detroit',
    conf: 'E', div: 'Atlantic',
    primary: '#CE1126', secondary: '#FFFFFF', textColor: '#FFFFFF',
    roster: [
      { n:'Larkin',     num:71, pos:'C',  spd:88, sht:85, pas:87, chk:78, ir:false },
      { n:'Raymond',    num:23, pos:'LW', spd:88, sht:82, pas:85, chk:70, ir:false },
      { n:'Tarasenko',  num:91, pos:'RW', spd:82, sht:90, pas:80, chk:72, ir:false },
      { n:'Copp',       num:18, pos:'C',  spd:82, sht:76, pas:78, chk:82, ir:false },
      { n:'Perron',     num:57, pos:'LW', spd:78, sht:80, pas:82, chk:72, ir:false },
      { n:'Kane',       num:10, pos:'LW', spd:86, sht:82, pas:78, chk:72, ir:false },
      { n:'Compher',    num:37, pos:'C',  spd:82, sht:76, pas:78, chk:78, ir:false },
      { n:'Rasmussen',  num:27, pos:'C',  spd:80, sht:74, pas:72, chk:80, ir:false },
      { n:'O\'Brien',   num:18, pos:'LW', spd:76, sht:68, pas:68, chk:82, ir:false },
      { n:'Seider',     num:53, pos:'D',  spd:84, sht:78, pas:86, chk:82, ir:false },
      { n:'Hronek',     num:96, pos:'D',  spd:82, sht:76, pas:82, chk:78, ir:false },
      { n:'Edvinsson',  num:32, pos:'D',  spd:82, sht:74, pas:78, chk:80, ir:false },
      { n:'Chiarot',    num: 3, pos:'D',  spd:74, sht:66, pas:70, chk:86, ir:false },
      { n:'Walman',     num:50, pos:'D',  spd:78, sht:70, pas:74, chk:78, ir:false },
      { n:'Talbot',     num:33, pos:'G',  spd:60, sht: 0, pas: 0, chk: 0, save:86, ir:false },
      { n:'Husso',      num:35, pos:'G',  spd:60, sht: 0, pas: 0, chk: 0, save:84, ir:false },
    ],
  },

  {
    id: 3, name: 'Florida Panthers', abbr: 'FLA', city: 'Florida',
    conf: 'E', div: 'Atlantic',
    primary: '#041E42', secondary: '#C8102E', textColor: '#C8102E',
    roster: [
      { n:'Barkov',     num:16, pos:'C',  spd:86, sht:88, pas:92, chk:82, ir:false },
      { n:'Tkachuk',    num:19, pos:'LW', spd:88, sht:86, pas:84, chk:92, ir:false },
      { n:'Reinhart',   num:13, pos:'C',  spd:84, sht:86, pas:86, chk:76, ir:false },
      { n:'Bennett',    num:93, pos:'C',  spd:90, sht:82, pas:80, chk:85, ir:false },
      { n:'Lundell',    num:22, pos:'C',  spd:82, sht:78, pas:78, chk:78, ir:false },
      { n:'Verhaeghe',  num:82, pos:'LW', spd:86, sht:80, pas:76, chk:76, ir:false },
      { n:'Rodrigues',  num:17, pos:'LW', spd:82, sht:74, pas:76, chk:72, ir:false },
      { n:'Staal',      num:12, pos:'C',  spd:72, sht:74, pas:74, chk:82, ir:false },
      { n:'Lanthier',   num:61, pos:'RW', spd:80, sht:70, pas:68, chk:80, ir:false },
      { n:'Ekblad',     num: 5, pos:'D',  spd:82, sht:82, pas:84, chk:86, ir:false },
      { n:'Forsling',   num:42, pos:'D',  spd:85, sht:76, pas:84, chk:80, ir:false },
      { n:'Montour',    num: 6, pos:'D',  spd:82, sht:78, pas:82, chk:78, ir:false },
      { n:'Kulikov',    num: 7, pos:'D',  spd:80, sht:70, pas:74, chk:78, ir:false },
      { n:'Mahura',     num:28, pos:'D',  spd:78, sht:68, pas:74, chk:76, ir:false },
      { n:'Bobrovsky',  num:72, pos:'G',  spd:58, sht: 0, pas: 0, chk: 0, save:91, ir:false },
      { n:'Stolarz',    num:41, pos:'G',  spd:60, sht: 0, pas: 0, chk: 0, save:87, ir:false },
    ],
  },

  {
    id: 4, name: 'Montreal Canadiens', abbr: 'MTL', city: 'Montreal',
    conf: 'E', div: 'Atlantic',
    primary: '#AF1E2D', secondary: '#192168', textColor: '#FFFFFF',
    roster: [
      { n:'Caufield',    num:22, pos:'RW', spd:85, sht:91, pas:78, chk:68, ir:false },
      { n:'Suzuki',      num:14, pos:'C',  spd:85, sht:82, pas:88, chk:75, ir:false },
      { n:'Slafkovsky',  num:20, pos:'LW', spd:84, sht:85, pas:78, chk:80, ir:false },
      { n:'Dach',        num:77, pos:'C',  spd:84, sht:80, pas:82, chk:76, ir:true  }, // ACL
      { n:'Anderson',    num:17, pos:'LW', spd:84, sht:78, pas:72, chk:82, ir:false },
      { n:'Gallagher',   num:11, pos:'RW', spd:80, sht:74, pas:72, chk:82, ir:false },
      { n:'Dvorak',      num:28, pos:'C',  spd:80, sht:72, pas:76, chk:76, ir:false },
      { n:'Armia',       num:40, pos:'RW', spd:80, sht:74, pas:70, chk:80, ir:false },
      { n:'Evans',       num:71, pos:'C',  spd:82, sht:68, pas:74, chk:78, ir:false },
      { n:'Matheson',    num: 8, pos:'D',  spd:84, sht:78, pas:82, chk:82, ir:false },
      { n:'Savard',      num:58, pos:'D',  spd:80, sht:72, pas:82, chk:80, ir:false },
      { n:'Guhle',       num:21, pos:'D',  spd:82, sht:72, pas:76, chk:82, ir:false },
      { n:'Xhekaj',      num:72, pos:'D',  spd:76, sht:66, pas:68, chk:88, ir:false },
      { n:'Harris',      num:34, pos:'D',  spd:76, sht:66, pas:70, chk:80, ir:false },
      { n:'Montembeault',num:35, pos:'G',  spd:60, sht: 0, pas: 0, chk: 0, save:87, ir:false },
      { n:'Primeau',     num:30, pos:'G',  spd:60, sht: 0, pas: 0, chk: 0, save:83, ir:false },
    ],
  },

  {
    id: 5, name: 'Ottawa Senators', abbr: 'OTT', city: 'Ottawa',
    conf: 'E', div: 'Atlantic',
    primary: '#C8102E', secondary: '#C69214', textColor: '#C69214',
    roster: [
      { n:'B.Tkachuk',  num: 7, pos:'LW', spd:86, sht:85, pas:82, chk:90, ir:false },
      { n:'Stutzle',    num:18, pos:'C',  spd:88, sht:84, pas:88, chk:75, ir:false },
      { n:'Giroux',     num:28, pos:'C',  spd:80, sht:80, pas:90, chk:78, ir:false },
      { n:'Greig',      num:71, pos:'C',  spd:84, sht:78, pas:80, chk:76, ir:false },
      { n:'Perron',     num:57, pos:'RW', spd:78, sht:80, pas:82, chk:72, ir:false },
      { n:'Batherson',  num:19, pos:'RW', spd:82, sht:82, pas:78, chk:70, ir:false },
      { n:'Norris',     num:23, pos:'C',  spd:86, sht:76, pas:76, chk:80, ir:false },
      { n:'Pinto',      num:43, pos:'C',  spd:82, sht:74, pas:76, chk:76, ir:false },
      { n:'Gambrell',   num:27, pos:'LW', spd:80, sht:68, pas:68, chk:78, ir:false },
      { n:'Sanderson',  num:85, pos:'D',  spd:84, sht:76, pas:85, chk:82, ir:false },
      { n:'Chabot',     num:72, pos:'D',  spd:84, sht:80, pas:88, chk:78, ir:false },
      { n:'Zub',        num: 2, pos:'D',  spd:78, sht:68, pas:74, chk:84, ir:false },
      { n:'Kleven',     num:44, pos:'D',  spd:80, sht:68, pas:72, chk:82, ir:false },
      { n:'Brannstrom', num: 3, pos:'D',  spd:82, sht:72, pas:80, chk:72, ir:false },
      { n:'Ullmark',    num:35, pos:'G',  spd:62, sht: 0, pas: 0, chk: 0, save:90, ir:false },
      { n:'Forsberg',   num:31, pos:'G',  spd:60, sht: 0, pas: 0, chk: 0, save:85, ir:false },
    ],
  },

  {
    id: 6, name: 'Tampa Bay Lightning', abbr: 'TBL', city: 'Tampa Bay',
    conf: 'E', div: 'Atlantic',
    primary: '#002868', secondary: '#FFFFFF', textColor: '#FFFFFF',
    roster: [
      { n:'Point',      num:21, pos:'C',  spd:86, sht:88, pas:88, chk:80, ir:false },
      { n:'Kucherov',   num:86, pos:'RW', spd:84, sht:90, pas:95, chk:72, ir:false },
      { n:'Hagel',      num:38, pos:'LW', spd:92, sht:82, pas:78, chk:80, ir:false },
      { n:'Paul',       num:20, pos:'C',  spd:82, sht:74, pas:74, chk:82, ir:false },
      { n:'Eyssimont',  num:23, pos:'C',  spd:84, sht:72, pas:72, chk:78, ir:false },
      { n:'Colton',     num:28, pos:'C',  spd:84, sht:76, pas:74, chk:80, ir:false },
      { n:'Atkinson',   num:13, pos:'RW', spd:80, sht:80, pas:74, chk:70, ir:false },
      { n:'Jeannot',    num:10, pos:'LW', spd:84, sht:76, pas:70, chk:86, ir:false },
      { n:'Gourde',     num:37, pos:'C',  spd:82, sht:74, pas:76, chk:80, ir:false },
      { n:'Hedman',     num:77, pos:'D',  spd:84, sht:82, pas:90, chk:86, ir:false },
      { n:'Cernak',     num:81, pos:'D',  spd:80, sht:72, pas:76, chk:88, ir:false },
      { n:'Bogosian',   num:44, pos:'D',  spd:76, sht:68, pas:72, chk:84, ir:false },
      { n:'Moser',      num:22, pos:'D',  spd:80, sht:70, pas:76, chk:78, ir:false },
      { n:'Fleury',     num: 7, pos:'D',  spd:82, sht:72, pas:78, chk:80, ir:false },
      { n:'Vasilevskiy',num:88, pos:'G',  spd:60, sht: 0, pas: 0, chk: 0, save:93, ir:false },
      { n:'Johansson',  num:31, pos:'G',  spd:60, sht: 0, pas: 0, chk: 0, save:83, ir:false },
    ],
  },

  {
    id: 7, name: 'Toronto Maple Leafs', abbr: 'TOR', city: 'Toronto',
    conf: 'E', div: 'Atlantic',
    primary: '#003E7E', secondary: '#FFFFFF', textColor: '#FFFFFF',
    roster: [
      { n:'Matthews',   num:34, pos:'C',  spd:86, sht:96, pas:86, chk:82, ir:false },
      { n:'Marner',     num:16, pos:'RW', spd:86, sht:82, pas:95, chk:72, ir:false },
      { n:'Nylander',   num:88, pos:'LW', spd:88, sht:88, pas:85, chk:72, ir:false },
      { n:'Tavares',    num:91, pos:'C',  spd:78, sht:84, pas:84, chk:78, ir:false },
      { n:'Domi',       num:49, pos:'C',  spd:84, sht:76, pas:80, chk:82, ir:false },
      { n:'Nylander',   num:29, pos:'LW', spd:80, sht:74, pas:76, chk:76, ir:false }, // Alex
      { n:'Reaves',     num:75, pos:'RW', spd:76, sht:68, pas:64, chk:92, ir:false },
      { n:'Minten',     num:64, pos:'C',  spd:82, sht:74, pas:76, chk:74, ir:false },
      { n:'Gregor',     num:18, pos:'LW', spd:78, sht:70, pas:70, chk:76, ir:false },
      { n:'Rielly',     num:44, pos:'D',  spd:84, sht:80, pas:88, chk:80, ir:false },
      { n:'McCabe',     num: 8, pos:'D',  spd:82, sht:78, pas:80, chk:82, ir:false },
      { n:'Brodie',     num:78, pos:'D',  spd:80, sht:72, pas:82, chk:78, ir:false },
      { n:'Liljegren',  num:37, pos:'D',  spd:82, sht:72, pas:78, chk:76, ir:false },
      { n:'Timmins',    num:17, pos:'D',  spd:78, sht:68, pas:74, chk:78, ir:false },
      { n:'Woll',       num:60, pos:'G',  spd:62, sht: 0, pas: 0, chk: 0, save:88, ir:false },
      { n:'Hildeby',    num:30, pos:'G',  spd:60, sht: 0, pas: 0, chk: 0, save:83, ir:false },
    ],
  },

  // ── METROPOLITAN, CENTRAL and PACIFIC divisions added in chunks 2b–2d ─────

]; // end TEAMS
