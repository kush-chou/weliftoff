package ai.substrata.liftoff

import ai.substrata.liftoff.core.model.UiState
import org.junit.Assert.assertEquals
import org.junit.Assert.assertTrue
import org.junit.Test

class UiStateTest {
    @Test
    fun testUiStateTransitions() {
        val loading: UiState<String> = UiState.Loading
        assertTrue(loading is UiState.Loading)

        val success: UiState<String> = UiState.Success("Hello Liftoff")
        assertEquals("Hello Liftoff", (success as UiState.Success).data)

        val empty: UiState<String> = UiState.Empty
        assertTrue(empty is UiState.Empty)

        val error: UiState<String> = UiState.Error("Offline invariant failure")
        assertEquals("Offline invariant failure", (error as UiState.Error).cause)
    }
}
