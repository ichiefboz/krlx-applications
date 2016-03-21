Template.step4.helpers({
	classList: [
		{title: '"A" classes (M/W/F)', options: ["1a", "2a", "3a", "4a", "5a", "6a"]},
		{title: '"C" classes (Tu/Th)', options: ["1-2c", "2-3c", "4-5c", "5-6c"]},
		{title: 'Language ("L") classes (daily)', options: ["1a (L)", "2a (L)", "3a (L)", "4a (L)", "5a (L)"]}
	]
})

Template.step4.rendered = function() {
	$(".ui.checkbox").checkbox();
}
