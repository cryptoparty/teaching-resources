Reveal.QuickAnimationTransformer = function(options) {

    var ANIMATION_ATTRIBUTE = 'data-animation-index';

    var SECTION_SELECTOR = '.reveal .slides section';

    var currentId = 1;

    (function construct() {
        options = options || {};
        options.duration = options.duration || 500;
        options.animationClass = options.animationClass || "animated-html";
        options.idPrefix = options.idPrefix || "data-quick-animation-";
    })();


    function getShortAnimationSections() {
        return $(SECTION_SELECTOR).filter(function() {
            // Returns sections without section children
            return $(this).find("section").length == 0;
        }).filter(function() {
                // Returns sections with short animation tags, but without animation class elements
                var animationElements = $(this).find('[' + ANIMATION_ATTRIBUTE + ']');
                var animationClassElements = $(this).find("." + options.animationClass);

                return animationElements.size() > 0 && animationClassElements.size() == 0;
            });
    }

    function getAnimationElements(section) {
        var animationElements = section.find('[' + ANIMATION_ATTRIBUTE + ']');
        var animationElementsArray = [];
        animationElements.each(function() {
            var element = $(this);
            var animationIndex = element.attr(ANIMATION_ATTRIBUTE);

            animationElementsArray[animationIndex] = animationElementsArray[animationIndex] || [];
            animationElementsArray[animationIndex].push(element);
        });

        return animationElementsArray;
    }

    function deleteUnusedIndexes(animationElements) {
        for (var i = animationElements.length - 1; i >= 0; i--) {
            if (!animationElements[i]) {
                animationElements.splice(i, 1);
            }
        }
    }

    function addAnimationPropertiesToElements(animationElements) {
        var i, j, id, animationElement;

        for (i = 0; i < animationElements.length; i++) {
            for (j = 0; j < animationElements[i].length; j++) {
                id = currentId++;
                animationElement = animationElements[i][j];

                animationElement.attr('id', options.idPrefix + id);
                animationElement.css('opacity', 0);
            }
        }
    }

    function addAnimationsToSection(section, animationElements) {
        var i, j, animationElement, elementId;

        var animationsText = "";
        for (i = 0; i < animationElements.length; i++) {
            animationsText += '<animation data-duration="' + options.duration + '">';

            for (j = 0; j < animationElements[i].length; j++) {
                animationElement = animationElements[i][j];
                elementId = animationElement.attr('id');
                animationsText += '<animate data-id="' + elementId + '" data-property="opacity" data-value="1"></animate>';
            }

            animationsText += '</animation>';
        }
        section.prepend(animationsText);
    }

    function addAnimationClassToSection(section) {
        section.addClass(options.animationClass);
    }

    function transformSection(section) {
        var animationElements = getAnimationElements(section);
        deleteUnusedIndexes(animationElements);

        addAnimationPropertiesToElements(animationElements);
        addAnimationsToSection(section, animationElements);
        addAnimationClassToSection(section);
    }

    function transformSections(sections) {
        sections.each(function() {
            transformSection($(this));
        });
    }

    function transform() {
        var sections = getShortAnimationSections();
        transformSections(sections);
    }

    return {
        transform: transform
    };
};