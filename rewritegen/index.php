<?php
use donatj\RewriteGenerator\ApacheModRewriteGenerator;
use donatj\RewriteGenerator\Engine;
use donatj\RewriteGenerator\RewriteTypes;

if( file_exists(__DIR__ . '/vendor/autoload.php') ) {
	require __DIR__ . '/vendor/autoload.php';
}

// Avoiding the composer autoloader momentarily for backwards compatibility
spl_autoload_register(function ( string $className ) {
	$parts = explode('\\', $className);
	array_shift($parts);
	array_shift($parts);
	$path = implode($parts, DIRECTORY_SEPARATOR);

	require "src/{$path}.php";
});

$paramRewrites = $_POST['tabbed_rewrites'] ?? <<<EOD
http://www.test.com/test.html	http://www.test.com/spiders.html
http://www.test.com/faq.html?faq=13&layout=bob	http://www.test2.com/faqs.html
http://www.test3.com/faq.html?faq=13&layout=bob	bbq.html
text/faq.html?faq=20	helpdesk/kb.php
EOD;
$paramComments = (bool)($_POST ? ($_POST['desc_comments'] ?? false) : true);
$paramType     = (int)($_POST['type'] ?? RewriteTypes::PERMANENT_REDIRECT);

$generator = new ApacheModRewriteGenerator;

$engine = new Engine($generator);
$output = $engine->generate($paramRewrites, $paramType, $paramComments);

?>
<form class="columns" method="post">

	<div class="options">
	<select name="type" title="Rewrite Type">
		<option value="<?= RewriteTypes::PERMANENT_REDIRECT ?>">301</option>
		<option value="<?= RewriteTypes::SERVER_REWRITE ?>" <?php echo $paramType === RewriteTypes::SERVER_REWRITE ? ' selected' : '' ?>>
			Rewrite
		</option>
	</select>
	<label>
		<input type="checkbox" name="desc_comments" value="1"<?php echo $paramComments ? ' checked' : '' ?>>Add comments to each rule
	</label>
	</div>

	<div class="col col-1">

		<textarea id="tsv-input" class="textarea" cols="100" rows="20" name="tabbed_rewrites" style="width: 100%; height: 265px;" title="TSV Input" placeholder="<?php echo htmlentities($paramRewrites) ?>"><?php // echo htmlentities($paramRewrites) ?></textarea>
		
		<input  class="button" value="Generate!" type="submit" />
	</div>

	<div class="col col-2">

		<textarea id="rewrite-output" class="textarea" cols="100" rows="20" readonly="readonly" style="width: 100%; height: 265px;<?= $engine->getLastErrorCount() > 0 ? 'background: LightPink;' : '' ?>" title="Rewrite Output" placeholder="<?php echo htmlentities($output) ?>"><?php // echo htmlentities($output) ?></textarea><br />
	
	</div>
</form>