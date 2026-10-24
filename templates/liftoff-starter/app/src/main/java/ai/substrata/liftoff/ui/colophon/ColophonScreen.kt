package ai.substrata.liftoff.ui.colophon

import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import ai.substrata.liftoff.BuildConfig

@Composable
fun ColophonScreen(modifier: Modifier = Modifier) {
    Scaffold(
        contentWindowInsets = WindowInsets.safeDrawing,
        modifier = modifier.fillMaxSize()
    ) { innerPadding ->
        Column(
            modifier = Modifier
                .consumeWindowInsets(innerPadding)
                .padding(innerPadding)
                .padding(16.dp)
                .fillMaxSize(),
            verticalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            Text("LIFTOFF ZERO-TO-ONE", style = MaterialTheme.typography.headlineMedium)
            HorizontalDivider()
            Text("AUTHORS: ${BuildConfig.STUDENT_HANDLES}", style = MaterialTheme.typography.bodyMedium)
            Text("COMMIT: ${BuildConfig.GIT_COMMIT_SHA}", style = MaterialTheme.typography.bodySmall)
            Text("BUILD TIME: ${BuildConfig.BUILD_TIMESTAMP}", style = MaterialTheme.typography.bodySmall)
            Text("LICENSE: ${BuildConfig.LICENSE}", style = MaterialTheme.typography.bodySmall)
        }
    }
}
