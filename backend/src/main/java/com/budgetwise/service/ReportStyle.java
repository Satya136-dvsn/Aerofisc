/*
 * © 2026 VenkataSatyanarayana Duba
 * aerofisc - Proprietary Software
 * Unauthorized copying or distribution prohibited.
*/

package com.budgetwise.service;

import com.itextpdf.kernel.colors.ColorConstants;
import com.itextpdf.kernel.colors.DeviceRgb;
import com.itextpdf.kernel.colors.Color;

public class ReportStyle {
    // Brand Colors
    public static final Color PRIMARY_COLOR = new DeviceRgb(44, 62, 80); // Midnight Blue
    public static final Color ACCENT_COLOR = new DeviceRgb(52, 152, 219); // Peter River Blue
    public static final Color SUCCESS_COLOR = new DeviceRgb(39, 174, 96); // Nephritis Green
    public static final Color DANGER_COLOR = new DeviceRgb(192, 57, 43); // Pomegranate Red
    public static final Color TEXT_COLOR = new DeviceRgb(44, 62, 80); // Dark Grey
    public static final Color LIGHT_BG_COLOR = new DeviceRgb(236, 240, 241); // Clouds
    public static final Color WHITE = ColorConstants.WHITE;

    // AWT Colors for JFreeChart
    public static final java.awt.Color AWT_PRIMARY = new java.awt.Color(44, 62, 80);
    public static final java.awt.Color AWT_ACCENT = new java.awt.Color(52, 152, 219);
    public static final java.awt.Color AWT_SUCCESS = new java.awt.Color(39, 174, 96);
    public static final java.awt.Color AWT_DANGER = new java.awt.Color(192, 57, 43);
    public static final java.awt.Color AWT_BG = new java.awt.Color(255, 255, 255);
    public static final java.awt.Color AWT_GRID = new java.awt.Color(220, 220, 220);

    // Font Sizes
    public static final float FONT_SIZE_TITLE = 26f;
    public static final float FONT_SIZE_HEADER = 18f;
    public static final float FONT_SIZE_SUBHEADER = 14f;
    public static final float FONT_SIZE_BODY = 10f;
    public static final float FONT_SIZE_SMALL = 8f;
}
