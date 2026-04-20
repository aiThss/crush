// ─── Vietnamese Food Dataset — Static, instant, grouped by category ───────────
export type Region = "bac" | "trung" | "nam";
export type Category = "an-chinh" | "an-vat";

export interface FoodItem {
  name: string;
  region: Region;
  category: Category;
  group: string;      // cluster key — used for smart group-switching
  desc: string;
}

export interface FoodGroupMeta {
  key: string;
  label: string;
  emoji: string;
  region: Region;
}

// Display metadata for each group
export const FOOD_GROUP_META: FoodGroupMeta[] = [
  // Bắc
  { key: "bac-pho-bun",  label: "Phở & Bún nước",         emoji: "🍜", region: "bac" },
  { key: "bac-banh-xoi", label: "Bánh & Xôi",              emoji: "🥮", region: "bac" },
  { key: "bac-lau-oc",   label: "Lẩu & Ốc",               emoji: "🦪", region: "bac" },
  { key: "bac-com",      label: "Cơm, Cháo & Chè",         emoji: "🍚", region: "bac" },
  { key: "bac-dac-san",  label: "Đặc sản truyền thống",    emoji: "🐟", region: "bac" },
  // Trung
  { key: "trung-bun-mi", label: "Bún & Mì miền Trung",     emoji: "🍜", region: "trung" },
  { key: "trung-banh",   label: "Bánh miền Trung",          emoji: "🥟", region: "trung" },
  { key: "trung-com",    label: "Cơm, Cháo & Chè Trung",   emoji: "🍚", region: "trung" },
  { key: "trung-bien",   label: "Đặc sản biển & Nướng",    emoji: "🦑", region: "trung" },
  // Nam
  { key: "nam-com-hu",   label: "Cơm & Hủ tiếu",           emoji: "🍛", region: "nam" },
  { key: "nam-bun-goi",  label: "Bún & Gỏi",               emoji: "🥗", region: "nam" },
  { key: "nam-banh-vat", label: "Bánh & Ăn vặt",           emoji: "🧆", region: "nam" },
  { key: "nam-canh-lau", label: "Canh, Lẩu & Cá kho",      emoji: "🍲", region: "nam" },
];

export const FOODS: FoodItem[] = [
  // ══════════════════════════════════════════════════════════════════════
  // MIỀN BẮC
  // ══════════════════════════════════════════════════════════════════════

  // ── Phở & Bún nước (10) ───────────────────────────────────────────────
  { name: "Phở bò Hà Nội",   region: "bac", category: "an-chinh", group: "bac-pho-bun", desc: "Nước dùng trong veo hầm xương bò lâu, topping bò tái hoặc bò chín thơm lừng." },
  { name: "Phở gà Hà Nội",   region: "bac", category: "an-chinh", group: "bac-pho-bun", desc: "Phở nước gà ta trong, topping gà ta xé nhỏ và hành lá xanh tươi." },
  { name: "Phở cuốn",         region: "bac", category: "an-vat",   group: "bac-pho-bun", desc: "Bánh phở cuộn thịt bò tái và rau thơm, chấm nước tương vừng dậy mùi." },
  { name: "Bún chả Hà Nội",   region: "bac", category: "an-chinh", group: "bac-pho-bun", desc: "Bún trắng chấm chả viên nướng than thơm trong bát nước mắm pha chua ngọt." },
  { name: "Bún đậu mắm tôm",  region: "bac", category: "an-chinh", group: "bac-pho-bun", desc: "Đậu phụ chiên vàng rụm, bún tươi và mắm tôm sánh đặc dậy mùi đặc trưng Hà Nội." },
  { name: "Bún riêu cua",     region: "bac", category: "an-chinh", group: "bac-pho-bun", desc: "Bún chan riêu cua đồng đỏ au, thêm đậu phụ chiên và cà chua chua dịu." },
  { name: "Bún ốc",           region: "bac", category: "an-chinh", group: "bac-pho-bun", desc: "Bún chan nước ốc chua cay, thêm cà chua và ốc bươu vừa chín tới ngọt thịt." },
  { name: "Bún thang",        region: "bac", category: "an-chinh", group: "bac-pho-bun", desc: "Bún chan nước gà trong vắt, topping trứng tráng mỏng, gà xé và giò lụa thanh." },
  { name: "Bún sườn",         region: "bac", category: "an-chinh", group: "bac-pho-bun", desc: "Bún chan nước sườn trong xương ngọt nhẹ, ăn kèm cải xanh luộc." },
  { name: "Bún bò Nam Bộ",    region: "bac", category: "an-chinh", group: "bac-pho-bun", desc: "Bún trộn bò xào sả ớt, lạc rang và rau thơm phiên bản cải biên miền Bắc." },

  // ── Bánh & Xôi (9) ────────────────────────────────────────────────────
  { name: "Bánh cuốn Hà Nội", region: "bac", category: "an-vat",   group: "bac-banh-xoi", desc: "Lớp bánh mỏng mịn cuộn thịt mộc nhĩ, chan nước chấm ngọt và hành phi thơm." },
  { name: "Bánh tôm Hồ Tây",  region: "bac", category: "an-vat",   group: "bac-banh-xoi", desc: "Bánh tôm chiên giòn rụm, ăn kèm rau sống và nước chấm chua ngọt đặc trưng." },
  { name: "Bánh giò",          region: "bac", category: "an-vat",   group: "bac-banh-xoi", desc: "Gói lá chuối nhân thịt mộc nhĩ hấp mềm, ăn nóng trong buổi sáng sớm Hà Nội." },
  { name: "Bánh mì pate",      region: "bac", category: "an-vat",   group: "bac-banh-xoi", desc: "Bánh mì cứng vỏ nhân pate gan thịt nguội rau thơm, hương vị Hà Nội truyền thống." },
  { name: "Bánh đúc nóng",     region: "bac", category: "an-vat",   group: "bac-banh-xoi", desc: "Bánh đúc ngô mặn ăn kèm tôm khô và nước mắm ớt, vị dân dã giữa phố." },
  { name: "Bánh rán mật",      region: "bac", category: "an-vat",   group: "bac-banh-xoi", desc: "Bánh mè rán vỏ giòn nhân đậu xanh mật mía ngọt thơm, đặc sản phố cổ." },
  { name: "Bánh khúc",         region: "bac", category: "an-vat",   group: "bac-banh-xoi", desc: "Xôi nhân đậu thịt gói trong lá khúc, hương xuân đặc trưng của Hà Nội." },
  { name: "Xôi gà",            region: "bac", category: "an-vat",   group: "bac-banh-xoi", desc: "Xôi trắng dẻo phủ gà xé và hành phi vàng, kèm nước mắm ngọt pha ớt." },
  { name: "Xôi xéo",           region: "bac", category: "an-vat",   group: "bac-banh-xoi", desc: "Xôi vàng từ nghệ, rắc đậu xanh xay và hành phi thơm bùi ăn sáng tuyệt." },

  // ── Lẩu & Ốc (3) ─────────────────────────────────────────────────────
  { name: "Lẩu cua đồng",      region: "bac", category: "an-chinh", group: "bac-lau-oc", desc: "Lẩu nước cua đỏ tươi, rau đồng quê ngập nồi, ngọt tự nhiên mang hương quê." },
  { name: "Lẩu Thái",          region: "bac", category: "an-chinh", group: "bac-lau-oc", desc: "Lẩu chua cay đặc trưng, nhiều hải sản và rau tươi, ăn không biết ngưng." },
  { name: "Ốc luộc bia",       region: "bac", category: "an-vat",   group: "bac-lau-oc", desc: "Ốc hấp bia thơm, chấm muối gừng và lá chanh mát, ăn cùng bạn bè là số một." },

  // ── Cơm, Cháo & Chè (4) ──────────────────────────────────────────────
  { name: "Cháo sườn",         region: "bac", category: "an-chinh", group: "bac-com", desc: "Cháo trắng hầm sườn thơm mềm, rắc tiêu hành ngò thơm nức mũi." },
  { name: "Miến gà",           region: "bac", category: "an-chinh", group: "bac-com", desc: "Miến trong vắt chan nước gà thơm ngọt, kèm gà luộc xé và mộc nhĩ mềm." },
  { name: "Cơm rang dưa bò",   region: "bac", category: "an-chinh", group: "bac-com", desc: "Cơm chiên dưa cải cùng bò băm thêm trứng và ớt xanh, mặn mà đậm đà." },
  { name: "Chè",               region: "bac", category: "an-vat",   group: "bac-com", desc: "Chè đậu xanh hoặc chè kho ngọt thanh, mát lành ăn mùa hè là cực phẩm." },

  // ── Đặc sản (3) ───────────────────────────────────────────────────────
  { name: "Chả cá Lã Vọng",   region: "bac", category: "an-chinh", group: "bac-dac-san", desc: "Cá lăng áp chảo với nghệ và thì là, ăn kèm bún trắng và mắm tôm nguyên chất." },
  { name: "Nem rán",           region: "bac", category: "an-vat",   group: "bac-dac-san", desc: "Chả giò nhân thịt cua bún miến chiên vàng giòn, chấm tương ớt." },
  { name: "Gà tần thuốc bắc", region: "bac", category: "an-chinh", group: "bac-dac-san", desc: "Gà ta hầm cùng các vị thuốc bắc thơm, nước tần trong bổ dưỡng." },

  // ══════════════════════════════════════════════════════════════════════
  // MIỀN TRUNG
  // ══════════════════════════════════════════════════════════════════════

  // ── Bún & Mì (5) ─────────────────────────────────────────────────────
  { name: "Bún bò Huế",              region: "trung", category: "an-chinh", group: "trung-bun-mi", desc: "Bún chan nước bò sả cay đỏ, kèm giò heo và chả cua đậm đà hương Huế." },
  { name: "Mì Quảng",                region: "trung", category: "an-chinh", group: "trung-bun-mi", desc: "Mì vàng trứng chan ít nước nhưng đầy topping tôm thịt trứng và bánh tráng giòn." },
  { name: "Cao lầu Hội An",          region: "trung", category: "an-chinh", group: "trung-bun-mi", desc: "Mì vàng dày sệt nước xá xíu, ăn kèm rau sống Hội An và tóp mỡ giòn." },
  { name: "Bún thịt nướng Huế",      region: "trung", category: "an-chinh", group: "trung-bun-mi", desc: "Bún trắng kèm thịt viên nướng sả thơm, rau sống và mắm ruốc đặc sản Huế." },
  { name: "Bún mắm nêm Quảng Nam",   region: "trung", category: "an-chinh", group: "trung-bun-mi", desc: "Bún chan nước mắm nêm đặc, ngọt bùi hương cá cơm đặc sản xứ Quảng." },

  // ── Bánh (10) ─────────────────────────────────────────────────────────
  { name: "Bánh mì Hội An",          region: "trung", category: "an-vat",   group: "trung-banh", desc: "Bánh mì vỏ mỏng nhân thập cẩm, phô mai bơ và tương ớt đặc riêng của Hội An." },
  { name: "Bánh bột lọc",            region: "trung", category: "an-vat",   group: "trung-banh", desc: "Bánh trong veo nhân tôm thịt dai ngọt, ăn kèm mắm ruốc chua cay Huế." },
  { name: "Bánh xèo Đà Nẵng",        region: "trung", category: "an-chinh", group: "trung-banh", desc: "Bánh xèo giòn rụm nhân tôm thịt, cuốn rau sống Đà Nẵng và chấm mắm nêm." },
  { name: "Bánh tráng cuốn thịt heo",region: "trung", category: "an-chinh", group: "trung-banh", desc: "Thịt heo ba chỉ luộc cuốn bánh tráng trắng mỏng với rau sống, chấm mắm nêm." },
  { name: "Bánh tráng đập Đà Nẵng",  region: "trung", category: "an-vat",   group: "trung-banh", desc: "Hai lớp bánh tráng nướng và ướt đập vào nhau, chan hành mỡ thơm nức." },
  { name: "Bánh căn Phan Rang",       region: "trung", category: "an-vat",   group: "trung-banh", desc: "Bánh chiên trong khuôn đất nhân trứng chim, ăn kèm nước chấm chua ngọt." },
  { name: "Bánh ướt thịt nướng Huế", region: "trung", category: "an-vat",   group: "trung-banh", desc: "Bánh ướt mỏng mềm ăn cùng thịt nướng ướp sả, chan mắm ruốc hương Huế." },
  { name: "Bánh Nậm Huế",            region: "trung", category: "an-vat",   group: "trung-banh", desc: "Bánh gói lá chuối dẹt nhân tôm thịt ướp tiêu sả, thấm đẫm hương vị Huế cổ." },
  { name: "Bánh mì Nha Trang",        region: "trung", category: "an-vat",   group: "trung-banh", desc: "Bánh mì chả cá Nha Trang nướng than, vị biển mặn mà độc đáo khó quên." },
  { name: "Bánh bèo Huế",            region: "trung", category: "an-vat",   group: "trung-banh", desc: "Bánh bèo nhỏ xinh xếp bát, phủ tôm chấy và hành phi, chan mỡ phi thơm nức." },

  // ── Cơm, Cháo & Chè (5) ──────────────────────────────────────────────
  { name: "Cơm hến",                 region: "trung", category: "an-chinh", group: "trung-com", desc: "Cơm trắng trộn hến xào mắm ruốc, múa mùi với đủ loại rau thơm Huế đặc trưng." },
  { name: "Cơm gà Hội An",           region: "trung", category: "an-chinh", group: "trung-com", desc: "Cơm nấu nước gà ta vàng ươm, kèm gà xé da giòn và tương ớt đặc Hội An." },
  { name: "Cơm lam",                 region: "trung", category: "an-chinh", group: "trung-com", desc: "Cơm nếp nướng trong ống tre, hương khói củi thoang thoảng ăn với muối vừng." },
  { name: "Cháo lòng Đà Nẵng",       region: "trung", category: "an-chinh", group: "trung-com", desc: "Cháo trắng chan lòng heo đủ vị, húp buổi sáng ấm lòng trước gió biển." },
  { name: "Chè Huế tổng hợp",        region: "trung", category: "an-vat",   group: "trung-com", desc: "Chè nhiều màu sắc đặc trưng Huế, từ hạt sen đến thạch nhân trần ngọt mát." },

  // ── Đặc sản biển & Nướng (5) ──────────────────────────────────────────
  { name: "Bê thui Cầu Mống",        region: "trung", category: "an-chinh", group: "trung-bien", desc: "Bê non thui vàng ruộm thịt mềm đỏ hồng, ăn cùng mắm nêm tỏi ớt đặc trưng." },
  { name: "Ốc hút sả ớt Đà Nẵng",   region: "trung", category: "an-vat",   group: "trung-bien", desc: "Ốc nhỏ hút cay thơm sả ớt, đặc sản ăn khuya trên phố biển Đà Nẵng." },
  { name: "Mực nướng muối ớt Mỹ Khê",region: "trung", category: "an-vat",   group: "trung-bien", desc: "Mực tươi nướng ngay trên bãi biển, chấm muối ớt xanh cay nhẹ hương biển." },
  { name: "Cá ngừ đại dương kho nghệ",region:"trung", category: "an-chinh", group: "trung-bien", desc: "Cá ngừ xốt nghệ vàng ruộm đậm vị, ăn với cơm trắng là hết nồi ngay." },
  { name: "Ram ít Đà Nẵng",          region: "trung", category: "an-vat",   group: "trung-bien", desc: "Ram chiên giòn ăn kèm bánh ít hấp, chấm nước mắm chanh xanh đặc biệt." },

  // ══════════════════════════════════════════════════════════════════════
  // MIỀN NAM
  // ══════════════════════════════════════════════════════════════════════

  // ── Cơm & Hủ tiếu (7) ────────────────────────────────────────────────
  { name: "Cơm tấm sườn bì chả",    region: "nam", category: "an-chinh", group: "nam-com-hu", desc: "Cơm tấm vun sườn nướng than, bì sợi và chả hấp, chan mỡ hành xèo xèo." },
  { name: "Hủ tiếu Nam Vang",        region: "nam", category: "an-chinh", group: "nam-com-hu", desc: "Hủ tiếu dai chan nước trong ngọt tôm mực, topping thịt xay và hành phi thơm." },
  { name: "Hủ tiếu bò kho",          region: "nam", category: "an-chinh", group: "nam-com-hu", desc: "Hủ tiếu mềm chan bò kho sệt màu đỏ với cà rốt khoai tây, ăn sáng chiều đều ngon." },
  { name: "Hủ tiếu Mỹ Tho",          region: "nam", category: "an-chinh", group: "nam-com-hu", desc: "Hủ tiếu sợi nhỏ dai, nước lèo ngọt từ mực tôm và xương heo đặc biệt Tiền Giang." },
  { name: "Hủ tiếu xào",             region: "nam", category: "an-chinh", group: "nam-com-hu", desc: "Hủ tiếu khô xào bò tôm rau cải, nêm tương đen đậm đà vừa miệng." },
  { name: "Cơm niêu Sài Gòn",        region: "nam", category: "an-chinh", group: "nam-com-hu", desc: "Cơm nấu niêu đất cháy đáy giòn thơm, ăn kèm thịt kho trứng hoặc sườn rim." },
  { name: "Phở bò Sài Gòn",          region: "nam", category: "an-chinh", group: "nam-com-hu", desc: "Phở nước trong ngọt, thêm nhiều topping, ăn kèm tương đen tương đỏ và rau giá." },

  // ── Bún & Gỏi (5) ────────────────────────────────────────────────────
  { name: "Bún thịt nướng Sài Gòn",  region: "nam", category: "an-chinh", group: "nam-bun-goi", desc: "Bún trắng kèm nem nướng và xá xíu thơm, chan nước mắm chua ngọt." },
  { name: "Bún nước lèo Sóc Trăng",  region: "nam", category: "an-chinh", group: "nam-bun-goi", desc: "Bún chan nước mắm bồn bồn đặc vị Khmer Nam Bộ, thêm tôm cá lóc ngọt thịt." },
  { name: "Bún mắm miền Tây",        region: "nam", category: "an-chinh", group: "nam-bun-goi", desc: "Bún chan nước mắm cá đặc, thêm tôm mực và rau muống, đậm hương sông nước." },
  { name: "Gỏi cuốn tôm thịt",       region: "nam", category: "an-vat",   group: "nam-bun-goi", desc: "Rau tươi tôm thịt cuộn bánh tráng mỏng, chấm tương đậu phộng béo bùi." },
  { name: "Gỏi ngó sen tôm thịt",    region: "nam", category: "an-vat",   group: "nam-bun-goi", desc: "Gỏi ngó sen chua ngọt kèm tôm thịt, ăn khai vị thanh mát trước bữa chính." },

  // ── Bánh & Ăn vặt (11) ────────────────────────────────────────────────
  { name: "Bánh mì Sài Gòn",         region: "nam", category: "an-vat",   group: "nam-banh-vat", desc: "Bánh mì cóc vỏ mỏng giòn, nhân đa dạng từ pate thịt nguội đến trứng chiên." },
  { name: "Bánh xèo miền Nam",       region: "nam", category: "an-chinh", group: "nam-banh-vat", desc: "Bánh xèo to vàng giòn cuộn xà lách cải xanh, nhúng mắm chua ngọt sả ớt." },
  { name: "Bánh tráng nướng Sài Gòn",region: "nam", category: "an-vat",   group: "nam-banh-vat", desc: "Bánh tráng nướng than nhân trứng mỡ hành tôm khô, giòn rụm ăn mãi không ngán." },
  { name: "Bánh khọt Vũng Tàu",      region: "nam", category: "an-vat",   group: "nam-banh-vat", desc: "Bánh chiên tròn xinh nhân tôm trong khuôn gang, ăn kèm rau sống và mắm chua." },
  { name: "Bánh tầm bì",             region: "nam", category: "an-vat",   group: "nam-banh-vat", desc: "Bánh tầm mềm phủ bì sợi dừa béo và tôm khô, ăn sáng đặc sản miền Tây." },
  { name: "Bánh chuối hấp",          region: "nam", category: "an-vat",   group: "nam-banh-vat", desc: "Chuối chín hấp trong lớp bột dừa béo ngọt thơm, đặc trưng Nam Bộ." },
  { name: "Bánh da lợn",             region: "nam", category: "an-vat",   group: "nam-banh-vat", desc: "Bánh nhiều tầng xanh vàng từ lá pandan và đậu xanh, dai mềm ngọt nhẹ." },
  { name: "Chả giò Sài Gòn",         region: "nam", category: "an-vat",   group: "nam-banh-vat", desc: "Nem chiên vỏ giòn lạo xạo nhân thịt tôm cua, chấm tương chua ngọt." },
  { name: "Kem bơ Đà Lạt",           region: "nam", category: "an-vat",   group: "nam-banh-vat", desc: "Bơ xay mịn với sữa tươi và đường, mát lạnh béo bùi giải nhiệt mùa hè." },
  { name: "Súp cua Sài Gòn",         region: "nam", category: "an-vat",   group: "nam-banh-vat", desc: "Súp cua sền sệt thơm trứng và cua biển, húp ấm vào buổi tối thật sự tuyệt." },
  { name: "Xôi gấc",                 region: "nam", category: "an-vat",   group: "nam-banh-vat", desc: "Xôi đỏ tươi từ gấc ngày lễ Tết, bùi ngọt mang ý nghĩa may mắn đỏ hồng." },

  // ── Canh, Lẩu & Cá kho (7) ───────────────────────────────────────────
  { name: "Lẩu mắm Cần Thơ",         region: "nam", category: "an-chinh", group: "nam-canh-lau", desc: "Lẩu mắm đặc cá linh, bông điên điển vàng, màu sậm đậm đà mùi đồng quê miền Tây." },
  { name: "Canh chua cá lóc",         region: "nam", category: "an-chinh", group: "nam-canh-lau", desc: "Canh chua me cà chua thơm cá lóc đồng, chan cơm trắng ăn hoài không chán." },
  { name: "Cá kho tộ",               region: "nam", category: "an-chinh", group: "nam-canh-lau", desc: "Cá lóc kho tộ sền sệt đậm đà, ăn cùng cơm trắng ngày mưa nghe thơm tuyệt." },
  { name: "Cháo vịt Cà Mau",         region: "nam", category: "an-chinh", group: "nam-canh-lau", desc: "Cháo vịt đặc bùi ngọt, chan thêm gừng và nước mắm ớt đặc sản vùng đất mũi." },
  { name: "Chè ba màu",              region: "nam", category: "an-vat",   group: "nam-canh-lau", desc: "Ba tầng đậu đỏ đậu xanh thạch xanh chan nước dừa béo với đá bào mát lạnh." },
  { name: "Bò 7 món",                region: "nam", category: "an-chinh", group: "nam-canh-lau", desc: "Bảy cách chế biến thịt bò từ tái chanh đến lòng xào, tiệc ăn kèm bạn bè ưa thích." },
  { name: "Gà nướng muối ớt Nam Bộ", region: "nam", category: "an-chinh", group: "nam-canh-lau", desc: "Gà ta nướng muối ớt xanh bọc lá chuối, thịt thơm da giòn hương đặc trưng." },
];

// ─── Activities ────────────────────────────────────────────────────────────────
export const ACTIVITIES: string[] = [
  "Chạy bộ đón gió",
  "Cày nốt series trên Netflix",
  "Ngủ nướng tới trưa",
  "Đi dạo chill chill lúc ráng chiều",
  "Nghe trọn một album của Lana Del Rey",
  "Đọc vài trang sách chưa đụng đến",
  "Quay lại thăm một quán cà phê quen",
  "Dọn dẹp phòng cho đầu óc thư thái",
  "Gọi video call cho người thân lâu không gặp",
  "Thử một bài tập yoga 15 phút",
  "Vẽ nguệch ngoặc bất kể đẹp xấu",
  "Pha một ly trà hoặc cà phê ngồi ngắm trời",
  "Xem một bộ anime lẻ hết trong tối",
  "Đi siêu thị và mua thứ gì đó ngoài danh sách",
  "Lướt Pinterest tìm cảm hứng mới",
  "Viết ra những thứ đang làm mình lo lắng rồi xé đi",
  "Nghe podcast về chủ đề mình chưa biết",
  "Chơi một game mobile nhẹ nhàng",
  "Xem lại bộ phim yêu thích hồi nhỏ",
  "Tắm nước ấm và không làm gì cả",
  "Thiền 10 phút theo hướng dẫn YouTube",
  "Học một vài từ tiếng Nhật ngẫu nhiên",
  "Đi bộ không mục đích 30 phút",
  "Xem TED Talk về chủ đề mình đang tò mò",
  "Ghi lại 3 điều tốt đẹp đã xảy ra hôm nay",
];
