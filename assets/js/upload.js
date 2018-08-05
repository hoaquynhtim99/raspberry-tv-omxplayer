/**
 * @Project NUKEVIET 4.x
 * @Author VINADES.,JSC <contact@vinades.vn>
 * @Copyright (C) 2014 VINADES.,JSC. All rights reserved
 * @License GNU/GPL version 2 or any later version
 * @Createdate 2-9-2010 14:43
 */

$(document).ready(function() {
	var cfg = {
		container: "#nv-filemanager",
		btnFolderMobileToggle: "#nv-filemanager-folder-btn-toggle",
		folderElement: "#nv-filemanager-folder",
		childFolderBtnToggle: "#nv-filemanager-folder a span.toggle",
		folderOpenFileBtn: "#nv-filemanager-folder a",
		btnChangeViewMode: "#nv-filemanager-btn-change-viewmode",
		btnReload: "#nv-filemanager-btn-reload",
		btnSearch: ".nv-filemanager-btn-search",
		btnFilterSort: ".nv-filemanager-btn-filter-sort",
		btnFilterUser: ".nv-filemanager-btn-filter-user",
		btnFilterType: ".nv-filemanager-btn-filter-type",
		ctnFilterSort: "#nv-filemanager-ctn-filter-sort",
		ctnFilterUser: "#nv-filemanager-ctn-filter-user",
		ctnFilterType: "#nv-filemanager-ctn-filter-type",
		loader: "#nv-filemanager-loader",
		dropzoneCtn: "#filemanager-dropzone-ctn",
		dropzoneArea: "#filemanager-dropzone-area",
		formFilter: "#nv-filemanager-form-filter",
		btnToggleFormFilter: "#nv-filemanager-btn-toggle-form-filter",
		filesContainer: "#nv-filemanager-files-container"
	};

	var ICON = [];
	ICON.select = 'icon far fa-check-square';
	ICON.download = 'icon fas fa-download';
	ICON.preview = 'icon far fa-eye';
	ICON.create = 'icon far fa-file';
	ICON.recreatethumb = 'icon fas fa-retweet';
	ICON.move = 'icon fas fa-arrows-alt';
	ICON.rename = 'icon fas fa-pencil-alt';
	ICON.filedelete = 'icon far fa-trash-alt';
	ICON.filecrop = 'icon fas fa-crop-alt';
	ICON.filerotate = 'icon fas fa-redo';
	ICON.addlogo = 'icon far fa-file-image';
	ICON.spin = 'icon fas fa-spinner';

	function openFolder() {
		var pr = $(cfg.btnFolderMobileToggle).parent();
		$(cfg.folderElement).slideDown(200, function() {
			pr.addClass('open');
		});
	}

	function closeFolder() {
		var pr = $(cfg.btnFolderMobileToggle).parent();
		$(cfg.folderElement).slideUp(200, function() {
			pr.removeClass('open');
		});
	}

	function showLoader() {
		$(cfg.container).addClass('loading');
	}

	function hideLoader() {
		$(cfg.container).removeClass('loading');
	}

	function setCurrentMobileFolderName(folder) {
		var arr = [$(folder).text()];
		while (1) {
			var isBreak = true;
			var prt = $(folder).parent().parent();
			if (prt.is('ul')) {
				folder = prt.prev();
				if (folder.length == 1 && folder.is('a')) {
					isBreak = false;
					arr.push(folder.text());
				}
			}
			if (isBreak) {
				break;
			}
		}
		var text = [];
		for (i = arr.length; i > 0; i--) {
			text.push(arr[i - 1]);
		}
		text = text.join('/');
		$(cfg.btnFolderMobileToggle).find('span').html(text);
	}

	// Khi click vào tên thư mục => Đóng mở thư mục ở chế độ mobile
	$(cfg.btnFolderMobileToggle).on('click', function() {
		var pr = $(this).parent();
		if (pr.hasClass('open')) {
			closeFolder();
		} else {
			openFolder();
		}
	});

	// Đóng mở thư mục con
	$(cfg.childFolderBtnToggle).on('click', function(e) {
		e.stopPropagation();
		e.preventDefault();
		var prtLink = $(this).parent();
		var prtLinkCtn = prtLink.parent();
		var subMenu = prtLink.next();
		if (prtLinkCtn.hasClass('open')) {
			subMenu.slideUp(200, function() {
				prtLinkCtn.removeClass('open');
				updatePerfectScrollbar();
			});
		} else {
			subMenu.slideDown(200, function() {
				prtLinkCtn.addClass('open');
				updatePerfectScrollbar();
			});
		}
	});

	// Mở file trong thư mục
	$(cfg.folderOpenFileBtn).on('click', function(e) {
		e.preventDefault();
		if ($(this).parent().is('.active')) {
			return false;
		}
		setCurrentMobileFolderName(this);
		$(cfg.folderElement).find('.active').removeClass('active');
		$(this).parent().addClass('active');
		if ($.isSm()) {
			closeFolder();
		}
		showLoader();
		setTimeout(function() {
			hideLoader();
			updatePerfectScrollbar();
		}, 1000);
	});

	// Thay đổi chế độ xem dạng lưới hay danh sách
	$(cfg.btnChangeViewMode).on('click', function(e) {
		e.preventDefault();
		if ($(cfg.container).is('.view-detail')) {
			$(cfg.container).addClass('view-gird');
			$(cfg.container).removeClass('view-detail');
		} else {
			$(cfg.container).addClass('view-detail');
			$(cfg.container).removeClass('view-gird');
		}
		setTimeout(function() {
			updatePerfectScrollbar();
		}, 251);
	});

	// Load lại file
	$(cfg.btnReload).on('click', function(e) {
		e.preventDefault();
		showLoader();
		setTimeout(function() {
			hideLoader();
			updatePerfectScrollbar();
		}, 1000);
	});

	// Xem theo ngày tháng
	$(cfg.btnFilterSort).on('click', function(e) {
		e.preventDefault();

		$(cfg.ctnFilterSort).data('value', $(this).data('value'));
		$(cfg.ctnFilterSort).find('.text').html($(this).html());

		showLoader();
		setTimeout(function() {
			hideLoader();
			updatePerfectScrollbar();
		}, 1000);
	});

	// Xem theo người đăng
	$(cfg.btnFilterUser).on('click', function(e) {
		e.preventDefault();

		$(cfg.ctnFilterUser).data('value', $(this).data('value'));
		$(cfg.ctnFilterUser).find('.text').html($(this).html());

		showLoader();
		setTimeout(function() {
			hideLoader();
			updatePerfectScrollbar();
		}, 1000);
	});

	// Xem theo loại file
	$(cfg.btnFilterType).on('click', function(e) {
		e.preventDefault();

		$(cfg.ctnFilterType).data('value', $(this).data('value'));
		$(cfg.ctnFilterType).find('.text').html($(this).html());

		showLoader();
		setTimeout(function() {
			hideLoader();
			updatePerfectScrollbar();
		}, 1000);
	});

	// Đóng mở form lọc ở mobile
	$(cfg.btnToggleFormFilter).on('click', function(e) {
		e.preventDefault();
		$(cfg.container).toggleClass('open-form-filter');
	});

	// Xử lý khi kéo thả file vào
	var isFireFox = navigator.userAgent.indexOf('Firefox') > -1;
	var dragInCurrentTarget = null;
	/*
	 * FifeFox lỗi không thể đếm kết thúc drag kiểu target
	 * Dùng phương thức couter
	 */
	var couterDragIn = 0;

	$(document).on('dragend', function(e) {
		dragInCurrentTarget = null;
		couterDragIn = 0;
	});

	$(document).on('dragleave', function(e) {
		couterDragIn--;
		if ((dragInCurrentTarget == e.target && !isFireFox) || (isFireFox && couterDragIn <= 0)) {
			e.stopPropagation();
			e.preventDefault();
			couterDragIn = 0;
			$(cfg.dropzoneCtn).hide();
			$(cfg.dropzoneCtn).removeClass('drag-hover');
		}
	});

	$(document).on('dragenter', function(e) {
		dragInCurrentTarget = e.target;
		e.stopPropagation();
		e.preventDefault();
		couterDragIn++;
		$(cfg.dropzoneCtn).show();
	});

	$(cfg.dropzoneArea).on('dragleave', function(e) {
		e.preventDefault();
		$(cfg.dropzoneCtn).removeClass('drag-hover');
	});

	$(cfg.dropzoneArea).on('dragenter', function(e) {
		e.preventDefault();
		$(cfg.dropzoneCtn).addClass('drag-hover');
	});

	$(document).on('drop', function(e) {
		dragInCurrentTarget = null;
		couterDragIn = 0;
	});

	/*
	 * Kéo thả chuột để chọn file
	 */
	$(cfg.filesContainer).selectable({
	    filter: '.file',
	    delay: 90,
	    start: function(e, ui) {
	        //NVCMENU.hide();
	    	// Thiết đặt true nhằm hạn chế ấn phím trong khi chọn
	        KEYPR.isSelectable = true;
	        KEYPR.isFileSelectable = true;
	    },
	    selecting: function(e, ui) {
	        fileSelecting(e, ui);
	    },
	    stop: function(e, ui) {
	        fileSelectStop(e, ui);
	        setTimeout(function() {
	        	// Kết thúc chọn thì lại có thể ấn phím
	            KEYPR.isSelectable = false;
	            KEYPR.isFileSelectable = false;
	        }, 50);
	    },
	    unselecting: function(e, ui) {
	        fileUnselect(e, ui);
	    },
	});

	// Xử lý khi ấn chuột trái, chuột giữa và chuột phải vào file
	$('.file', $(cfg.filesContainer)).bind("mouseup", function(e) {
	    e.preventDefault();
	    fileMouseup(this, e);
	});

	// Khi mở menu chuột phải thì không xử lý gì.
	$('.file', $(cfg.filesContainer)).bind("contextmenu", function(e) {
		e.preventDefault();
	});

	/*
	 * Xử lý khi thay đổi màn hình
	 */
	$(window).on('resize', function() {
		$(cfg.folderElement).removeAttr('style');
	});

	/*
	 * Khi đang kéo thả để chọn file
	 */
	function fileSelecting(e, ui) {
	    if (e.ctrlKey) {
	    	// Giữ CTRL để chọn thêm file hoặc bỏ file đã chọn
	        if ($(ui.selecting).is('.file-selected')) {
	            $(ui.selecting).addClass('file-unselected-temp');
	        } else {
	            $(ui.selecting).addClass('file-selected-temp');
	        }
	    } else if (e.shiftKey) {
	    	// Giữ SHIFT để thêm file (không bỏ file đã chọn)
	        $(ui.selecting).addClass('file-selected-temp');
	    } else {
	    	// Mặc định thì bỏ những file đã chọn trước đó và chọn file mới
	        $(ui.selecting).removeClass('file-unselected-temp').addClass('file-selected-temp');
	        $('.file:not(.file-selected-temp)', $(cfg.filesContainer)).addClass('file-unselected-temp');
	    }
	}

	/*
	 * Khi thôi chọn file
	 */
	function fileUnselect(e, ui) {
	    $(ui.unselecting).removeClass('file-unselected-temp file-selected-temp');
	}

	/*
	 * Khi kết thúc kéo thả chọn file
	 */
	function fileSelectStop(e, ui) {
	    $(cfg.filesContainer).find('.ui-selected').removeClass('ui-selected');
	    $('.file-selected-temp', $(cfg.filesContainer)).addClass('file-selected').removeClass('file-selected-temp');
	    $('.file-unselected-temp', $(cfg.filesContainer)).removeClass('file-selected file-unselected-temp');
	    LFILE.setSelFile();
	}

	/*
	 * Xử lý khi ấn chuột vào file.
	 * Bao gồm cả chuột trái, chuột giữa, chuột phải
	 */
	function fileMouseup(file, e) {
	    // Khong xu ly neu jquery UI selectable dang kich hoat
	    if (KEYPR.isFileSelectable == false) {
	        // Set shift offset
	        if (e.which != 3 && !KEYPR.isShift) {
	            // Reset shift offset
	            KEYPR.shiftOffset = 0;

	            $.each($('.file', $(cfg.filesContainer)), function(k, v) {
	                if (v == file) {
	                    KEYPR.shiftOffset = k;
	                    return false;
	                }
	            });
	        }

	        // e.which: 1: Left Mouse, 2: Center Mouse, 3: Right Mouse
	        if (KEYPR.isCtrl) {
	            if ($(file).is('.file-selected') && e.which != 3) {
	                $(file).removeClass('file-selected');
	            } else {
	                $(file).addClass('file-selected');
	            }
	        } else if (KEYPR.isShift && e.which != 3) {
	            var clickOffset = -1;
	            $('.file', $(cfg.filesContainer)).removeClass('file-selected');

	            $.each($('.file', $(cfg.filesContainer)), function(k, v) {
	                if (v == file) {
	                    clickOffset = k;
	                }

	                if ((clickOffset == -1 && k >= KEYPR.shiftOffset) || (clickOffset != -1 && k <= KEYPR.shiftOffset) || v == file) {
	                    if (!$(v).is('.file-selected')) {
	                        $(v).addClass('file-selected');
	                    }
	                }
	            });
	        } else {
	            if (e.which != 3 || (e.which == 3 && !$(file).is('.file-selected'))) {
	                $('.file-selected', $(cfg.filesContainer)).removeClass('file-selected');
	                $(file).addClass('file-selected');
	            }
	        }

	        LFILE.setSelFile();

        	/*
        	 * Mở menu khi ấn chuột phải
        	 */
	        if (e.which == 3) {
	            var isMultiple = $('.file-selected', $(cfg.filesContainer)).length === 1 ? false : true;
	            var fileExt = $("input[name=selFile]").val().slice(-3);
	            var CKEditorFuncNum = $("input[name=CKEditorFuncNum]").val();
	            var area = $("input[name=area]").val();
	            var html = "";

	            // Menu chọn file
	            if ((CKEditorFuncNum > 0 || area != "") && !isMultiple) {
	                html += '<a class="dropdown-item" id="select"><i class="' + ICON.select + '"></i>' + LANG.select + '</a>';
	            }

	            // Nếu không chọn nhiều file thì cho phép xem chi tiết và tải xuống
	            if (!isMultiple) {
	                html += '<a class="dropdown-item" id="download" href="#"><i class="' + ICON.download + '"></i>' + LANG.download + '</a>';
	                html += '<a class="dropdown-item" id="filepreview" href="#"><i class="' + ICON.preview + '"></i>' + LANG.preview + '</a>';
	            }

	            // Các thao tác xử lý nếu đây là ảnh
	            if ($.inArray(fileExt, array_images) !== -1) {
	                if ($("span#create_file").attr("title") == "1" && !isMultiple) {
	                    html += '<a class="dropdown-item" id="fileaddlogo" href="#"><i class="' + ICON.addlogo + '"></i>' + LANG.addlogo + '</a>';
	                    html += '<a class="dropdown-item" id="create" href="#"><i class="' + ICON.create + '"></i>' + LANG.upload_createimage + '</a>';
	                    html += '<a class="dropdown-item" id="cropfile" href="#"><i class="' + ICON.filecrop + '"></i>' + LANG.crop + '</a>';
	                    html += '<a class="dropdown-item" id="rotatefile" href="#"><i class="' + ICON.filerotate + '"></i>' + LANG.rotate + '</a>';
	                }
	            }

	            // Cho phép di chuyển file
	            if (1) {
	                html += '<a class="dropdown-item" id="move" href="#"><i class="' + ICON.move + '"></i>' + LANG.move + '</a>';
	            }

	            // Cho phép đổi tên file
	            if (1 && !isMultiple) {
	                html += '<a class="dropdown-item" id="rename" href="#"><i class="' + ICON.rename + '"></i>' + LANG.rename + '</a>';
	            }

	            // Cho phép xóa file
	            if (1) {
	                html += '<a class="dropdown-item" id="filedelete" href="#"><i class="' + ICON.filedelete + '"></i>' + LANG.upload_delfile + '</a>';
	            }

	            $("div#contextMenu").html(html);
	            NVCMENU.show(e);
	        }

	    }

	    KEYPR.isFileSelectable = false;
	}

	/*
	 * Xử lý thao tác
	 * - Load lại danh sách file
	 * - Chọn file
	 */
	var LFILE = {
	    reload: function(path, file) {
	        var imgtype = $("select[name=imgtype]").val();
	        var author = $("select[name=author]").val() == 1 ? "&author" : "";
	        var order = $("select[name=order]").val();

	        // Reset shift offset
	        KEYPR.shiftOffset = 0;

	        $("#imglist").html(nv_loading_data).load(nv_module_url + "imglist&path=" + path + "&type=" + imgtype + "&imgfile=" + file + author + "&order=" + order + "&num=" + nv_randomNum(10), function() {
	            LFILE.setViewMode();
	        });
	    },
	    setSelFile: function() {
	        $("input[name=selFile]").val('');

	        if ($('.file-selected').length) {
	            fileName = new Array();
	            $.each($('.file-selected'), function() {
	                fileName.push($(this).attr("title"));
	            });
	            fileName = fileName.join('|');

	            $("input[name=selFile]").val(fileName);
	        }
	    },
	    setViewMode: function() {
	        var numFiles = $('[data-img="false"]').length;
	        var numImage = $('[data-img="true"]').length;
	        var autoMode = $(".viewmode em").data('auto');

	        if (autoMode) {
	            if (numImage > numFiles) {
	                $('#imglist').removeClass('view-detail');
	            } else if (numFiles > 0) {
	                $('#imglist').addClass('view-detail');
	            }
	        }

	        LFILE.setViewIcon();
	    },
	    setViewIcon: function() {
	        if ($('#imglist').is('.view-detail')) {
	            $('.viewmode em').removeClass('fa-hourglass-o fa-spin fa-list').addClass('fa-file-image-o').attr('title', $('.viewmode em').data('langthumb'));
	        } else {
	            $('.viewmode em').removeClass('fa-hourglass-o fa-spin fa-file-image-o').addClass('fa-list').attr('title', $('.viewmode em').data('langdetail'));
	        }
	    }
	}

	/*
	 * Xử lý thao tác bàn phím trong khu vực danh sách các file
	 */
	var KEYPR = {
	    isCtrl: false,
	    isShift: false,
	    shiftOffset: 0,
	    allowKey: [112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 123],
	    isSelectable: false,
	    isFileSelectable: false,
	    init: function() {
	        $('body').keyup(function(e) {
	            if (!$(e.target).is('.dynamic') && $.inArray(e.keyCode, KEYPR.allowKey) == -1) {
	                e.preventDefault();
	            } else {
	                return;
	            }

	            // Ctrl key unpress
	            if (e.keyCode == 17) {
	                KEYPR.isCtrl = false;
	            } else if (e.keyCode == 16) {
	                KEYPR.isShift = false;
	            }
	        });

	        $('body').keydown(function(e) {
	            if (!$(e.target).is('.dynamic') && $.inArray(e.keyCode, KEYPR.allowKey) == -1) {
	                e.preventDefault();
	            } else {
	                return;
	            }

	            // Ctrl key press
	            if (e.keyCode == 17 /* Ctrl */ ) {
	                KEYPR.isCtrl = true;
	            } else if (e.keyCode == 27 /* ESC */ ) {
	                // Unselect all file
	                $(".file-selected").removeClass("file-selected");
	                LFILE.setSelFile();

	                // Hide contextmenu
	                NVCMENU.hide();

	                // Reset shift offset
	                KEYPR.shiftOffset = 0;
	            } else if (e.keyCode == 65 /* A */ && e.ctrlKey === true) {
	                // Select all file
	                $(".file", $(cfg.filesContainer)).addClass("file-selected");
	                LFILE.setSelFile();

	                // Hide contextmenu
	                NVCMENU.hide();
	            } else if (e.keyCode == 16 /* Shift */ ) {
	                KEYPR.isShift = true;
	            } else if (e.keyCode == 46 /* Del */ ) {
	                // Delete file
	                if ($('.file-selected').length && $("span#delete_file").attr("title") == '1') {
	                    filedelete();
	                }
	            } else if (e.keyCode == 88 /* X */ ) {
	                // Move file
	                if ($('.file-selected').length && $("span#move_file").attr("title") == '1') {
	                    move();
	                }
	            }
	        });

	        // Unselect file when click on wrap area
	        $(cfg.filesContainer).click(function(e) {
	            if (KEYPR.isSelectable == false) {
	            	if (!$(e.target).closest('.file').length) {
	            		$(".file-selected").removeClass("file-selected");
	            	}
	            }

	            KEYPR.isSelectable = false;
	        });
	    }
	};

	/* Rorate Handle */
	var RRT = {
	    direction: 0,
	    currentDirection: 0,
	    arrayDirection: [0, 90, 180, 270],
	    timer: null,
	    timeOut: 20,
	    trigger: function() {
	        $('#rorateContent img').rotate(RRT.direction);
	    },
	    setVal: function() {
	        $('[name="rorateDirection"]').val(RRT.direction);
	    },
	    setDirection: function(direction) {
	        if (direction == '') {
	            RRT.direction = 0;
	        } else {
	            direction = parseInt(direction);

	            if (direction >= 360) {
	                direction = 359;
	            } else if (direction < 0) {
	                direction = 0;
	            }

	            RRT.direction = direction;
	        }
	    },
	    increase: function() {
	        var direction = RRT.direction;
	        direction++;

	        if (direction == 360) {
	            direction = 0;
	        }

	        RRT.setDirection(direction);
	        RRT.setVal();
	        RRT.trigger();
	    },
	    decrease: function() {
	        var direction = RRT.direction;
	        direction--;

	        if (direction == -1) {
	            direction = 359;
	        }

	        RRT.setDirection(direction);
	        RRT.setVal();
	        RRT.trigger();
	    },
	    init: function() {
	        $('[name="rorateDirection"]').keyup(function() {
	            var direction = $(this).val();

	            if (isNaN(direction)) {
	                direction = direction.slice(0, direction.length - 1);
	            }

	            RRT.setDirection(direction);
	            RRT.setVal();
	            RRT.trigger();
	        });

	        $('#rorateLeft').mousedown(function() {
	            RRT.timer = setInterval("RRT.decrease()", RRT.timeOut);
	        });

	        $('#rorateLeft').bind("mouseup mouseleave", function() {
	            clearInterval(RRT.timer);
	        });

	        $('#rorateRight').mousedown(function() {
	            RRT.timer = setInterval("RRT.increase()", RRT.timeOut);
	        });

	        $('#rorateRight').bind("mouseup mouseleave", function() {
	            clearInterval(RRT.timer);
	        });

	        $('#rorate90Anticlockwise').click(function() {
	            RRT.currentDirection--;

	            if (RRT.currentDirection < 0) {
	                RRT.currentDirection = 3;
	            }

	            RRT.setDirection(RRT.arrayDirection[RRT.currentDirection]);
	            RRT.setVal();
	            RRT.trigger();
	        });

	        $('#rorate90Clockwise').click(function() {
	            RRT.currentDirection++;

	            if (RRT.currentDirection > 3) {
	                RRT.currentDirection = 0;
	            }

	            RRT.setDirection(RRT.arrayDirection[RRT.currentDirection]);
	            RRT.setVal();
	            RRT.trigger();
	        });

	        $('#rorateimageOK').click(function() {
	            var roratePath = $('[name="roratePath"]').val();
	            var rorateFile = $('[name="rorateFile"]').val();
	            var rorateDirection = $('[name="rorateDirection"]').val();

	            $(this).attr("disabled", "disabled");

	            $.ajax({
	                type: "POST",
	                url: nv_module_url + "rotateimg&num=" + nv_randomNum(10),
	                data: "path=" + roratePath + "&file=" + rorateFile + "&direction=" + rorateDirection,
	                success: function(g) {
	                    $('#rorateimageOK').removeAttr("disabled");
	                    var h = g.split("#");

	                    if (h[0] == "ERROR") {
	                        alert(h[1]);
	                    } else {
	                        $("div#rorateimage").dialog("close");
	                        LFILE.reload(roratePath, rorateFile);
	                    }
	                }
	            });
	        });
	    }
	};

	var NVCMENU = {
	    menu: null,
	    bindings: {
	        select: function() {
	            insertvaluetofield();
	        },
	        download: function() {
	            download();
	        },
	        filepreview: function() {
	            preview();
	        },
	        fileaddlogo: function() {
	            addlogo();
	        },
	        create: function() {
	            create();
	        },
	        move: function() {
	            move();
	        },
	        rename: function() {
	            filerename();
	        },
	        filedelete: function() {
	            filedelete();
	        },
	        cropfile: function() {
	            cropfile();
	        },
	        rotatefile: function() {
	            rotatefile();
	        },
	        renamefolder: function() {
	            renamefolder()
	        },
	        createfolder: function() {
	            createfolder()
	        },
	        recreatethumb: function() {
	            recreatethumb()
	        },
	        deletefolder: function() {
	            deletefolder()
	        }
	    },
	    init: function() {
	        NVCMENU.menu = $('<div id="nvContextMenu" class="dropdown-menu"></div>').appendTo('body').bind('click', function(e) {
	            e.stopPropagation();
	        });
	        NVCMENU.menu.bind('contextmenu', function(e) {
	        	e.preventDefault();
	        });
	        $(document).delegate('*', 'click', function(e) {
	            if (e.which != 3) {
	                NVCMENU.hide();
	            }
	        });
	    },
	    show: function(e) {
	        e.preventDefault();

	        if ($('#contextMenu').html() != '') {
	        	var content = $('#contextMenu').html();
	            NVCMENU.menu.html(content);

	            $.each(NVCMENU.bindings, function(id, func) {
	                $('#' + id, NVCMENU.menu).bind('click', function(e) {
	                    NVCMENU.hide();
	                    func();
	                });
	            });

	            // Xác định lại vị trí cái menu cho phù hợp
	            var menuLeft = e.pageX + 1;
	            var menuTop = e.pageY + 1;

	            var itemHeight = 34;
	            var menuWidth = 185;
	            // Số item + khoảng cách trên dưới + viền trên dưới
	            var menuHeight = (NVCMENU.menu.find('>a').length * itemHeight) + 7 + 7 + 1 + 1;

	            var maxLeft = $('body').width() - menuWidth - 5;
	            var maxTop = $('body').height() - menuHeight - 5;

	            if (menuLeft > maxLeft) {
	            	menuLeft = maxLeft;
	            }
	            if (menuTop > maxTop) {
	            	menuTop = maxTop;
	            }

	            NVCMENU.menu.css({
	                'left': '0px',
	                'top': '0px',
	                'will-change' : 'transform',
	                'position': 'absolute',
	            	'transform': 'translate3d(' + menuLeft + 'px, ' + menuTop + 'px, 0px)',
	            	'width': menuWidth + 'px'
	            }).show();
	        }
	        return false;
	    },
	    hide: function() {
	        NVCMENU.menu.hide();
	    }
	};

	var NVLDATA = {
	    support: false,
	    init: function() {
	        if (typeof(Storage) !== "undefined") {
	            NVLDATA.support = true;
	        }
	    },
	    getValue: function(key) {
	        if (!NVLDATA.support) {
	            return '';
	        }

	        if (typeof(sessionStorage[key]) !== "undefined" && sessionStorage[key]) {
	            return sessionStorage[key];
	        }

	        return '';
	    },
	    setValue: function(key, val) {
	        sessionStorage[key] = val;
	    }
	};

	KEYPR.init();
	RRT.init();
	NVCMENU.init();
	NVLDATA.init();
});
