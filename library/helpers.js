var currentPage = [doc currentPage],
	currentArtboard = [[doc currentPage] currentArtboard],
	stage = currentArtboard ? currentArtboard : currentPage

function showDialog (message, OKHandler) {
  var alert = [COSAlertWindow new];
  [alert setMessageText: kPluginName]
  [alert setInformativeText: message]
  var responseCode = [alert runModal];	
  if(OKHandler != nil && responseCode == 0) OKHandler()
}

function selectionIsEmpty() {
	return ([selection count] == 0)
}

function getTempFolderPath(withName) {
	var fileManager = [NSFileManager defaultManager];
	var cachesURL = [[fileManager URLsForDirectory:NSCachesDirectory inDomains:NSUserDomainMask] lastObject];
	if(typeof withName !== 'undefined') return [[cachesURL URLByAppendingPathComponent:kPluginDomain] path] + "/" + withName;
	return [[cachesURL URLByAppendingPathComponent:kPluginDomain] path] + "/" + [[NSDate date] timeIntervalSince1970];
}

function createFolderForPath(pathString) {
	var fileManager = [NSFileManager defaultManager];
	if([fileManager fileExistsAtPath:pathString]) return true;
	return [fileManager createDirectoryAtPath:pathString withIntermediateDirectories:true attributes:nil error:nil]
}

function writeTextToFile(text, filePath) {
	var t = [NSString stringWithFormat:@"%@", text],
		f = [NSString stringWithFormat:@"%@", filePath];
    return [t writeToFile:f atomically:true encoding:NSUTF8StringEncoding error:nil];
}

function getRect(layer) {
  var rect = [layer absoluteRect];
  return {
    x: Math.round([rect x]),
    y: Math.round([rect y]),
    width: Math.round([rect width]),
    height: Math.round([rect height])
  };
}

function removeLayer(layer) {
  var parent = [layer parentGroup];
  if (parent)[parent removeLayer: layer];
}

function setSize(layer, width, height, absolute) {
  if(absolute){
    [[layer absoluteRect] setWidth: width];
    [[layer absoluteRect] setHeight: height];
  }
  else{
    [[layer frame] setWidth: width];
    [[layer frame] setHeight: height];
  }

  return layer;
}

function setPosition(layer, x, y, absolute) {
  if(absolute){
    [[layer absoluteRect] setX: x];
    [[layer absoluteRect] setY: y];
  }
  else{
    [[layer frame] setX: x];
    [[layer frame] setY: y];
  }

  return layer;
}


function addBitmap(filePath, parent, name) {
	var parent = parent ? parent : stage,
		layer = [MSBitmapLayer new];
	
	if(![parent documentData]) {
		showDialog("Before adding a Bitmap, add its parent to the document.")
		return
	}
	
	if(!name) name = "Bitmap"
	[layer setName:name]
	[parent addLayers:[layer]]
		
	var image = [[NSImage alloc] initWithContentsOfFile:filePath]
	if(image) {
		var originalImageSize = [image size],
			fills = [[layer style] fills];
		
		[layer setConstrainProportions:false]
		[fills addNewStylePart]
		[[fills firstObject] setIsEnabled:false]
		[layer setRawImage:image convertColourspace:false collection:[[doc documentData] images]]
		[[layer frame] setWidth:originalImageSize.width]
		[[layer frame] setHeight:originalImageSize.height]
		[layer setConstrainProportions:true]
	} else {
		showDialog("Image file could not be found!")
	}
	return layer;
}