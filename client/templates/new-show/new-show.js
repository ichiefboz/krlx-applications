var randomName = function() {
	var quantifiers = ["A Pile of", "The", "Some", "Fifteen", "Four", "Random", "Stevie P's", "Pineapples, Bacon, and"];

	var adjectives = ["abandoned", "able", "absolute", "academic", "acceptable", "acclaimed", "accomplished", "accurate", "aching", "acidic", "acrobatic", "adorable", "adventurous", "babyish", "back", "bad", "baggy", "bare",
	"barren", "basic", "beautiful", "belated", "beloved", "calculating", "calm", "candid", "canine", "capital", "carefree", "careful", "careless", "caring", "cautious", "cavernous", "celebrated", "charming", "damaged", "damp",
	"dangerous", "dapper", "daring", "dark", "darling", "dazzling", "dead", "deadly", "deafening", "dear", "dearest", "eager", "early", "earnest", "easy", "easygoing", "ecstatic", "edible", "educated", "fabulous", "failing",
	"faint", "fair", "faithful", "fake", "familiar", "famous", "fancy", "fantastic", "far", "faraway", "farflung", "faroff", "gargantuan", "gaseous", "general", "generous", "gentle", "genuine", "giant", "giddy", "gigantic",
	"hairy", "handmade", "handsome", "handy", "happy", "hard", "icky", "icy", "ideal", "idealistic", "identical", "idiotic", "idle", "idolized", "ignorant", "ill", "illegal", "jaded", "jagged", "jampacked", "kaleidoscopic",
	"keen", "lame", "large", "last", "lasting", "late", "lavish", "lawful", "mad", "madeup", "magnificent", "majestic", "major", "male", "mammoth", "married", "marvelous", "naive", "narrow", "nasty", "natural", "naughty",
	"obedient", "obese", "oblong", "oblong", "obvious", "occasional", "oily", "palatable", "pale", "paltry", "parallel", "parched", "partial", "passionate", "past", "pastel", "peaceful", "peppery", "perfect", "perfumed", "quaint",
	"qualified", "radiant", "ragged", "rapid", "rare", "rash", "raw", "recent", "reckless", "rectangular", "sad", "safe", "salty", "same", "sandy", "sane", "sarcastic", "sardonic", "satisfied", "scaly", "scarce", "scared",
	"scary", "scented", "scholarly", "scientific", "scornful", "scratchy", "scrawny", "second", "secondary", "secondhand", "secret", "selfassured", "selfish", "sentimental", "talkative", "tall", "tame", "tan", "tangible",
	"tart", "tasty", "tattered", "taut", "tedious", "teeming", "ugly", "ultimate", "unacceptable", "unaware", "uncomfortable", "uncommon", "unconscious", "understated", "unequaled", "vacant", "vague", "vain", "valid", "wan",
	"warlike", "warm", "warmhearted", "warped", "wary", "wasteful", "watchful", "waterlogged", "watery", "wavy", "yawning", "yearly", "zany"];

	var animals = ["alligators", "anteaters", "armadillos", "badgers", "bats", "beavers", "buffalo", "camels", "chameleons", "cheetahs", "chipmunks", "chinchillas", "coyotes", "crows", "dingos", "dinosaurs", "dolphins",
	"ducks", "elephants", "ferrets", "foxes", "frogs", "giraffes", "gophers", "grizzlies", "hedgehogs", "hippos", "hyenas", "jackalopes", "iguanas", "koalas", "lemurs", "leopards", "ligers", "lizards", "llamas", "manatees",
	"minks", "monkeys", "moose", "narwhals", "orangutans", "otters", "pandas", "penguins", "platypuses", "pythons", "pumpkins", "rabbits", "raccoons", "rhinos", "sheep", "skunks", "squirrels", "tigers", "turtles", "walruses", "wolves", "wolverines", "wombats"];

	var quantifier = quantifiers[Math.floor(Math.random() * quantifiers.length)];
	var adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
	var animal = animals[Math.floor(Math.random() * animals.length)];

	var showName = quantifier;
	showName += " " + adjective.charAt(0).toUpperCase() + adjective.slice(1);
	showName += " " + animal.charAt(0).toUpperCase() + animal.slice(1);

	return showName;
}

Template.newShow.helpers({
	randomShowName: randomName,
	errorPossibilities: [
		{code: "too-many-incomplete-applications", header: "Too many incomplete applications", message: "You have too many outstanding applications for this term and cannot create another. You must cancel an existing application if you wish to create a new one. If you absolutely must create an additional application, please email an IT engineer."},
		{code: "not-authorized", header: "Not Signed In", message: "You need to be signed in to create an application! Click \"Sign In\" below to sign in with your Carleton account, then try again.", flags: ["nevermind", "signin"]},
		{code: "invalid-type", header: "Invalid Type Selected", message: "Whoops, something went wrong and we don't know what show type you want! Reload the page and try again."},
		{code: "fcc-dirty-words", header: "Show Name Not Permitted", message: "KRLX regulations prohibit show titles from containing any of the seven dirty words. Please choose a different show title, or click the \"Get another suggestion\" link to generate a random title."}
	]
})

Template.newShow.rendered = function() {
	$(".ui.checkbox").checkbox();
}

Template.newShow.events({
	"click .regenerate-random-name": function() {
		var newName = randomName();
		$("#title").val(newName);
	},
	"click .create-show": function(event) {
		var showType = event.currentTarget.dataset.type;
		var showTitle = $("#title").val().trim();
		if(showTitle.length == 0) showTitle = randomName();
		Meteor.call("createShow", showType, showTitle, function(error, result) {
			if(result) {
				Router.go("shows.application", {_id: result, step: 1})
			}
			if(error) {
				$("#error-"+error.error).modal("show");
			}
		});
	}
})
