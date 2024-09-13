/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2024 Vsengine Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Global constants.
 *
 * @ignore
 */

var CONST = {
    /**
     * Vsengine Release Version
     *
     * @name Vsengine.VERSION
     * @const
     * @type {string}
     * @since 3.0.0
     */
    VERSION: "3.85.1",

    BlendModes: require("./renderer/BlendModes"),

    ScaleModes: require("./renderer/ScaleModes"),

    /**
     * This setting will auto-detect if the browser is capable of suppporting WebGL.
     * If it is, it will use the WebGL Renderer. If not, it will fall back to the Canvas Renderer.
     *
     * @name Vsengine.AUTO
     * @const
     * @type {number}
     * @since 3.0.0
     */
    AUTO: 0,

    /**
     * Forces Vsengine to only use the Canvas Renderer, regardless if the browser supports
     * WebGL or not.
     *
     * @name Vsengine.CANVAS
     * @const
     * @type {number}
     * @since 3.0.0
     */
    CANVAS: 1,

    /**
     * Forces Vsengine to use the WebGL Renderer. If the browser does not support it, there is
     * no fallback to Canvas with this setting, so you should trap it and display a suitable
     * message to the user.
     *
     * @name Vsengine.WEBGL
     * @const
     * @type {number}
     * @since 3.0.0
     */
    WEBGL: 2,

    /**
     * A Headless Renderer doesn't create either a Canvas or WebGL Renderer. However, it still
     * absolutely relies on the DOM being present and available. This mode is meant for unit testing,
     * not for running Vsengine on the server, which is something you really shouldn't do.
     *
     * @name Vsengine.HEADLESS
     * @const
     * @type {number}
     * @since 3.0.0
     */
    HEADLESS: 3,

    /**
     * In Vsengine the value -1 means 'forever' in lots of cases, this const allows you to use it instead
     * to help you remember what the value is doing in your code.
     *
     * @name Vsengine.FOREVER
     * @const
     * @type {number}
     * @since 3.0.0
     */
    FOREVER: -1,

    /**
     * Direction constant.
     *
     * @name Vsengine.NONE
     * @const
     * @type {number}
     * @since 3.0.0
     */
    NONE: 4,

    /**
     * Direction constant.
     *
     * @name Vsengine.UP
     * @const
     * @type {number}
     * @since 3.0.0
     */
    UP: 5,

    /**
     * Direction constant.
     *
     * @name Vsengine.DOWN
     * @const
     * @type {number}
     * @since 3.0.0
     */
    DOWN: 6,

    /**
     * Direction constant.
     *
     * @name Vsengine.LEFT
     * @const
     * @type {number}
     * @since 3.0.0
     */
    LEFT: 7,

    /**
     * Direction constant.
     *
     * @name Vsengine.RIGHT
     * @const
     * @type {number}
     * @since 3.0.0
     */
    RIGHT: 8,
};

module.exports = CONST;
